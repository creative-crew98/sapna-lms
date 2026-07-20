import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { PROGRAMS } from '@/lib/razorpay'
import { razorpay } from '@/lib/razorpay'

import { adminDb } from '@/lib/firebase-admin'

export async function POST(req: NextRequest) {
  try {
    const { programId, userId, userEmail, userName } = await req.json()

    // ── Validate inputs ───────────────────────────────────────────────────────
    if (
      !programId ||
      !userId ||
      typeof programId !== 'string' ||
      typeof userId !== 'string'
    ) {
      return NextResponse.json(
        { error: 'programId and userId are required' },
        { status: 400 },
      )
    }

    if (!PROGRAMS[programId]) {
      return NextResponse.json(
        { error: 'Invalid program selected' },
        { status: 400 },
      )
    }

    // ── Block admin accounts ──────────────────────────────────────────────────
    const userDoc = await adminDb.collection('users').doc(userId).get()

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (userDoc.data()?.role === 'admin') {
      return NextResponse.json(
        { error: 'Admin accounts cannot make payments' },
        { status: 403 },
      )
    }

    // ── Check if already enrolled ─────────────────────────────────────────────
    const existingEnroll = await adminDb
      .collection('enrollments')
      .where('userId', '==', userId)
      .where('programId', '==', programId)
      .get()

    if (!existingEnroll.empty) {
      return NextResponse.json(
        { error: 'Already enrolled in this program' },
        { status: 400 },
      )
    }

    // ── Create Razorpay order ─────────────────────────────────────────────────
    const program = PROGRAMS[programId]

    const order = await razorpay.orders.create({
      amount: program.amount,
      currency: 'INR',
      // Razorpay caps `receipt` at 40 chars — a raw Firebase UID + programId +
      // timestamp easily blew past that, causing order creation to fail every time.
      receipt: crypto
        .createHash('sha256')
        .update(`${userId}_${programId}_${Date.now()}`)
        .digest('hex')
        .slice(0, 32),
      notes: {
        userId,
        programId,
        userEmail,
        userName,
      },
    })

    // ── Save pending payment ──────────────────────────────────────────────────
    await adminDb.collection('payments').add({
      orderId: order.id,
      userId,
      programId,
      userEmail,
      userName,
      amount: program.amount,
      currency: 'INR',
      status: 'created',
      createdAt: new Date(),
    })

    return NextResponse.json({
      orderId: order.id,
      amount: program.amount,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      program,
    })
  } catch (err: any) {
    console.error('create-order error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 },
    )
  }
}
