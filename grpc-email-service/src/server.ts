import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import database from '../models/index';


const PROTO_PATH = path.join(__dirname, '../proto/email.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const emailProto = grpc.loadPackageDefinition(packageDefinition) as any;
const server = new grpc.Server();

function sendEmail(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
  console.log('Received request to send email:', call.request);
  
  const data =call.request
 

  const  from= 'your-email@gmail.com' 
   const to= call.request.to 
   const  subject= call.request.subject 
    const text= call.request.text 
    console.log(from,to,subject,text,"adjadjadjaksdjakdjakdas;dkasdlakd;ladka")
     
    console.log(data,"iwwferewrwr:::::::::::::::::::::::::::::::::::::::::::::::::");
        const user = database.userModel.create({
          from,
          to,
          subject,
          text,
     
        });
      }
      
      function getEmail(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
        const { id } = call.request;
      
        database.userModel.findByPk(id)
          .then(email => {
            if (email) {
              callback(null, { email }); // Sending the found email back
            } else {
              callback({
                code: grpc.status.NOT_FOUND,
                details: 'Email not found'
              }, null);
            }
          })
          .catch(err => callback(err, null));
      }
      
      function updateEmail(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
        const { id, to, subject, text } = call.request;
        
        console.log('Received update request:', { id, to, subject, text });
      
        if (!id) {
          callback({
            code: grpc.status.INVALID_ARGUMENT,
            details: 'ID must be provided'
          }, { success: false });
          return;
        }
      
        // Continue with the update logic
        database.userModel.update({ to, subject, text }, { where: { id } })
          .then(([affectedCount]) => {
            if (affectedCount > 0) {
              callback(null, { success: true });
            } else {
              callback({
                code: grpc.status.NOT_FOUND,
                details: 'Email not found'
              }, { success: false });
            }
          })
          .catch(err => callback(err, { success: false }));
      }
      
      

      function deleteEmail(call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) {
        const { id } = call.request;
      
        database.userModel.destroy({ where: { id } })
          .then(affectedCount => {
            if (affectedCount > 0) {
              callback(null, { success: true });  
            } else {
              callback({
                code: grpc.status.NOT_FOUND,
                details: 'Email not found'
              }, { success: false });
            }
          })
          .catch(err => callback(err, { success: false }));
      }
        
      const EmailService = emailProto.email.EmailService.service;
server.addService(EmailService, { SendEmail: sendEmail,
  GetEmail: getEmail,           
  UpdateEmail: updateEmail,     
  DeleteEmail: deleteEmail
 });

server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), () => {
  console.log('Email service gRPC server running at http://0.0.0.0:50052');
});
