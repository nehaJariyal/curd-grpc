 
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import database from '../models/index';

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

const server = new grpc.Server();

async function CreateUser(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
  const userRequest = call.request;

  if (!userRequest.username || !userRequest.password) {
    return callback({
      code: grpc.status.INVALID_ARGUMENT,
      message: 'Invalid username or password',
    }, null);
  }

  try {
    const user = await database.userModel.create(userRequest);

    const EmailService = (emailProto as any).EmailService;
    const emailClient = new EmailService(
      'localhost:50052',
      grpc.credentials.createInsecure()
    );

    const emailRequest = {
      to: 'example@example.com',
      subject: 'New User Registered',
      text: `${userRequest.username}, thank you for visiting our site.`,
    };

    emailClient.SendEmail(emailRequest, (emailError: any, emailResponse: any) => {
      if (emailError) {
        console.error('Error sending email:', emailError);
        return callback({
          code: grpc.status.INTERNAL,
          details: 'Error sending email',
        }, null);
      }

      const responseData = {
        status: 'success',
        message: 'User created successfully and email sent',
        data: {
          username: user.username,
        },
      };

      console.log('User created:', user);
      callback(null, responseData);
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return callback({
      code: grpc.status.INTERNAL,
      details: 'Error saving user data',
    }, null);
  }
}

async function ReadUser(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
  const userId = call.request.id;

  try {
    const user = await database.userModel.findByPk(userId);

    if (!user) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'User not found',
      }, null);
    }

    callback(null, user);
  } catch (error) {
    console.error('Error reading user:', error);
    return callback({
      code: grpc.status.INTERNAL,
      details: 'Error reading user data',
    }, null);
  }
}

async function UpdateUser(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
  const userId = call.request.id;
  const updatedData = call.request;

  try {
    const user = await database.userModel.findByPk(userId);

    if (!user) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'User not found',
      }, null);
    }

    const updatedUser = await user.update(updatedData);

    console.log('User updated:', updatedUser);

    callback(null, updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return callback({
      code: grpc.status.INTERNAL,
      details: 'Error updating user data',
    }, null);
  }
}

async function DeleteUser(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
  const userId = call.request.id;

  try {
    const user = await database.userModel.findByPk(userId);

    if (!user) {
      return callback({
        code: grpc.status.NOT_FOUND,
        message: 'User not found',
      }, null);
    }

    await user.destroy();

    callback(null, { message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return callback({
      code: grpc.status.INTERNAL,
      details: 'Error deleting user data',
    }, null);
  }
}

const UserService = (userProto as any).UserService.service;
server.addService(UserService, {
  CreateUser,
  ReadUser,
  UpdateUser,
  DeleteUser,
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Failed to start server:', err);
    return;
  }
  console.log(`User service gRPC server running at http://0.0.0.0:${port}`);
  // server.start();
});
