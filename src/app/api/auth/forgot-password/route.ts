// src/app/api/auth/forgot-password/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/_lib/prisma';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Por segurança, sempre retornar sucesso (não revelar se o email existe)
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'Se o email existir, você receberá um link de recuperação',
      });
    }

    // Gerar token de recuperação
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

    // Salvar token no banco
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Configurar transporte de email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // URL de redefinição - CORRIGIDO AQUI ✅
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/redefinir-senha?token=${resetToken}`;

    // Enviar email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Litera <seu-email-real@gmail.com>',
      to: email,
      subject: 'Recuperação de Senha - Litera',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #167eea 0%, #000eea 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .header h1 { color: white; margin: 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #000eea; color: #ffffff !important; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Recuperação de Senha</h1>
            </div>
            <div class="content">
              <p>Olá, <strong>${user.name}</strong>!</p>
              <p>Você solicitou a recuperação de senha da sua conta Litera.</p>
              <p>Clique no botão abaixo para redefinir sua senha:</p>
              <p style="text-align: center;">
                <a href="${resetUrl}" class="button">Redefinir Senha</a>
              </p>
              <p><strong>⏰ Este link expira em 1 hora.</strong></p>
              <p>Se você não solicitou essa recuperação, ignore este email. Sua senha permanecerá segura.</p>
              <hr>
              <p style="font-size: 12px; color: #666;">
                Se o botão não funcionar, copie e cole este link no navegador:<br>
                <a href="${resetUrl}">${resetUrl}</a>
              </p>
            </div>
            <div class="footer">
              <p>© 2024 Litera - Biblioteca Digital</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Email de recuperação enviado com sucesso!',
    });

  } catch (error) {
    console.error('Erro ao recuperar senha:', error);
    return NextResponse.json(
      { error: 'Erro ao enviar email de recuperação' },
      { status: 500 }
    );
  }
}