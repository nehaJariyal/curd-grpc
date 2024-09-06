 
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const USER_PROTO_PATH = path.join(__dirname, '../proto/user.proto');
const userPackageDefinition = protoLoader.loadSync(USER_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(userPackageDefinition).user;

const EMAIL_PROTO_PATH = path.join(__dirname, '../proto/email.proto');
const emailPackageDefinition = protoLoader.loadSync(EMAIL_PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const emailProto = grpc.loadPackageDefinition(emailPackageDefinition).email;

const userClient = new (userProto as any).UserService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

const emailClient = new (emailProto as any).EmailService(
  'localhost:50052',
  grpc.credentials.createInsecure()
);

function createUserAndSendEmail() {
  const userRequest = {
    username: 'newuser',
    password: 'password123',
  };

  userClient.CreateUser(userRequest, (error: any, response: any) => {
    if (error) {
      console.error('Error creating user:', error);
    } else {
      console.log('User created successfully:', response);

      const emailRequest = {
        to: 'example@example.com',
        subject: 'Welcome!',
        text: `Hello ${response.data.username}, welcome to our service!`,
      };

      emailClient.SendEmail(emailRequest, (emailError: any, emailResponse: any) => {
        if (emailError) {
          console.error('Error sending email:', emailError);
        } else {
          console.log('Email sent successfully:', emailResponse);
        }
      });
    }
  });
}

function readUser(userId: number) {
  userClient.ReadUser({ id: userId }, (error: any, response: any) => {
    if (error) {
      console.error('Error reading user:', error);
    } else {
      console.log('User details:', response);
    }
  });
}

function updateUser(userId: number, updatedData: any) {
  const request = {
    id: userId,
    ...updatedData,
  };

  userClient.UpdateUser(request, (error: any, response: any) => {
    if (error) {
      console.error('Error updating user:', error);
    } else {
      console.log('User updated successfully:', response);
    }
  });
}

function deleteUser(userId: number) {
  userClient.DeleteUser({ id: userId }, (error: any, response: any) => {
    if (error) {
      console.error('Error deleting user:', error);
    } else {
      console.log('User deleted successfully:', response);
    }
  });
}

function sendEmail() {
  const emailRequest = {
    to: 'recipient@example.com',
    subject: 'Hello from gRPC!',
    text: 'This is a test email sent from the gRPC client.',
  };

  emailClient.SendEmail(emailRequest, (error: any, response: any) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent successfully:', response);
    }
  });
}

function readEmail(emailId: number) {
  emailClient.GetEmail({ id: emailId }, (error: any, response: any) => {
    if (error) {
      console.error('Error reading email:', error);
    } else {
      console.log('Email details:', response);
    }
  });
}

function updateEmail(emailId: number, updatedData: any) {
  const request = {
    id: emailId,
    ...updatedData,
  };

  emailClient.UpdateEmail(request, (error: any, response: any) => {
    if (error) {
      console.error('Error updating email:', error);
    } else {
      console.log('Email updated successfully:', response);
    }
  });
}

function deleteEmail(emailId: number) {
  emailClient.DeleteEmail({ id: emailId }, (error: any, response: any) => {
    if (error) {
      console.error('Error deleting email:', error);
    } else {
      console.log('Email deleted successfully:', response);
    }
  });
}

// Example usage
// createUserAndSendEmail();    
// readUser(1);                
// updateUser(1, { username: 'updatedUser' ,password:"neha123"});   
// deleteUser(1);              

// sendEmail();                 
// readEmail(1);                
// updateEmail(1, { subject: 'this email for job' ,to:"ne@gmail.com",text:" thanks  to visit our site " });   
deleteEmail(12);             





