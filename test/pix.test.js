import test from 'node:test';
import assert from 'node:assert/strict';
import handler,{validDocument} from '../api/pix.js';
const customer={name:'Cliente Teste',email:'teste@example.com',phone:'11999999999',document:'52998224725'};
function response(){return {setHeader(){},status(n){this.code=n;return this;},json(v){this.data=v;return this;}};}
test('valida documentos',()=>{assert.equal(validDocument(customer.document),true);assert.equal(validDocument('11111111111'),false);assert.equal(validDocument('52998224726'),false);});
test('integração, preço fixo, configuração ausente e falha da operadora',async()=>{
 const fetchOriginal=global.fetch,key=process.env.BLACKCAT_API_KEY;
 try{
 delete process.env.BLACKCAT_API_KEY;let res=response();await handler({method:'POST',body:customer},res);assert.equal(res.code,503);
 process.env.BLACKCAT_API_KEY='test-only';let request;
 global.fetch=async(url,options)=>{request=JSON.parse(options.body);assert.equal(options.headers['X-API-Key'],'test-only');return {ok:true,json:async()=>({success:true,data:{transactionId:'test',paymentData:{copyPaste:'000201-test',qrCodeBase64:'data:image/png;base64,AAAA'}}})};};
 res=response();await handler({method:'POST',body:{...customer,amount:1}},res);assert.equal(res.code,200);assert.equal(request.amount,39770);assert.equal(request.items[0].unitPrice,39770);assert.equal(res.data.code,'000201-test');assert.equal(JSON.stringify(res.data).includes('test-only'),false);
 global.fetch=async()=>{throw new Error('timeout');};res=response();await handler({method:'POST',body:customer},res);assert.equal(res.code,502);assert.ok(res.data.reference);
 res=response();await handler({method:'POST',body:{...customer,document:'11111111111'}},res);assert.equal(res.code,400);
 res=response();await handler({method:'GET'},res);assert.equal(res.code,405);
 }finally{global.fetch=fetchOriginal;if(key===undefined)delete process.env.BLACKCAT_API_KEY;else process.env.BLACKCAT_API_KEY=key;}
});
