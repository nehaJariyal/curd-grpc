import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

// Load email.proto for sending emails
const EMAIL_PROTO_PATH = path.join(__dirname, '../proto/email.proto');
const emailPackageDefinition = protoLoader.loadSync(EMAIL_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const emailProto = grpc.loadPackageDefinition(emailPackageDefinition).email;

const EmailService = (emailProto as any).EmailService;

export async function sendEmail(emailRequest: { to: string, subject: string, text: string }) {
  const emailClient = new EmailService(
    'localhost:50052',
    grpc.credentials.createInsecure()
  );

  return new Promise((resolve, reject) => {
    emailClient.SendEmail(emailRequest, (error: any, response: any) => {
      if (error) {
        console.error('Error sending email:', error);
        reject(error);
      } else {
        console.log('Email sent:', response);
        resolve(response);
      }
    });
  });
}
