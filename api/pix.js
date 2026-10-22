import { randomUUID } from 'node:crypto';
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');
 if(req.method!=='POST')return res.status(405).json({error:'Método não permitido.'});
 if(!process.env.BLACKCAT_API_KEY)return res.status(503).json({error:'Pagamento temporariamente indisponível. Entre em contato com o vendedor.'});
 let b;try{b=typeof req.body==='string'?JSON.parse(req.body):req.body;}catch{return res.status(400).json({error:'Dados inválidos.'});}
 const name=String(b?.name||'').trim(),email=String(b?.email||'').trim(),phone=String(b?.phone||'').replace(/\D/g,''),number=String(b?.document||'').replace(/\D/g,'');
 if(name.length<3||name.length>150||!/^\S+@\S+\.\S+$/.test(email)||email.length>254||!/^\d{10,13}$/.test(phone)||!validDocument(number))return res.status(400).json({error:'Confira seu nome, e-mail, CPF/CNPJ e celular.'});
 const reference=randomUUID();
 try{
 const response=await fetch('https://api.blackcatoficial.com/api/sales/create-sale',{method:'POST',headers:{'Content-Type':'application/json','X-API-Key':process.env.BLACKCAT_API_KEY},body:JSON.stringify({amount:39770,currency:'BRL',paymentMethod:'pix',items:[{title:'NeuroBlack',unitPrice:39770,quantity:1,tangible:false}],customer:{name,email,phone,document:{number,type:number.length===11?'cpf':'cnpj'}},pix:{expiresInDays:1},externalRef:reference}),signal:AbortSignal.timeout(25000)});
 const body=await response.json();
 const data=body.data,payment=data?.paymentData,code=payment?.copyPaste||payment?.qrCode;
 if(!response.ok||body.success!==true||!code){return res.status(502).json({error:response.status===400?'A operadora recusou os dados. Confira o cadastro.':'Não foi possível confirmar a geração. Confira no suporte antes de tentar novamente.',reference});}
 return res.status(200).json({code,qr:payment.qrCodeBase64||null,expiresAt:payment.expiresAt||null,reference:data.transactionId});
 }catch{return res.status(502).json({error:'A operadora não confirmou a resposta. Confira no suporte antes de tentar novamente.',reference});}
}
export function validDocument(n){
 if(!/^(\d{11}|\d{14})$/.test(n)||/^(\d)\1+$/.test(n))return false;
 const calc=(s,w)=>{const r=s.split('').reduce((a,v,i)=>a+Number(v)*w[i],0)%11;return r<2?0:11-r;};
 if(n.length===11)return calc(n.slice(0,9),[10,9,8,7,6,5,4,3,2])===+n[9]&&calc(n.slice(0,10),[11,10,9,8,7,6,5,4,3,2])===+n[10];
 return calc(n.slice(0,12),[5,4,3,2,9,8,7,6,5,4,3,2])===+n[12]&&calc(n.slice(0,13),[6,5,4,3,2,9,8,7,6,5,4,3,2])===+n[13];
}
