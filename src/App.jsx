import { useState, useEffect, useRef } from "react";

/* ═══ CONFIG ═══ */
const ODS = { company:"ODS SRL Sibiu", cif:"39899930", reg:"J32/1279/2018", phone:"+40 746 752 240", email:"promovare@oradesibiu.ro" };
const WP = {
  url: import.meta.env.VITE_WP_URL || "https://www.oradesibiu.ro",
  rest: "/wp-json/wp/v2",
  user: import.meta.env.VITE_WP_USER || "",
  pass: import.meta.env.VITE_WP_PASS || "",
};
const C = { navy:"#0A1628", navy2:"#0F2040", amber:"#F59E0B", amberDeep:"#D97706", green:"#059669", greenBg:"#D1FAE5", red:"#EF4444", blue:"#3B82F6", white:"#FFF", g50:"#F8FAFC", g100:"#F1F5F9", g200:"#E2E8F0", g300:"#CBD5E1", g400:"#94A3B8", g600:"#475569", g700:"#334155" };

/* ═══ PACKAGES ═══ */
const PKG = [
  { id:"social-single", name:"Postare Social Media", cat:"oneTime", price:500, sub:null, color:C.amber,
    headline:"O postare profesionala pe Facebook si Instagram",
    inc:[{w:"1 postare Facebook",d:"218.000+ urmaritori"},{w:"1 postare Instagram",d:"18.000+ urmaritori"},{w:"Link direct",d:"Site, FB, telefon sau WhatsApp"}],
    delivery:"Publicare in maxim 24h", hasArticle:false },
  { id:"social-pack", name:"Vizibilitate Social Media", cat:"monthly", price:700, sub:600, color:C.blue,
    headline:"Prezenta constanta pe retelele Ora de Sibiu",
    inc:[{w:"4 postari/luna Facebook",d:"Reach organic garantat"},{w:"4 postari/luna Instagram",d:"Feed + Stories"},{w:"2 story-uri/luna",d:"Format vertical, swipe-up"},{w:"Raport lunar",d:"Reach, engagement, click-uri"}],
    delivery:"Prima postare in max 24h", hasArticle:false },
  { id:"mini-business", name:"Mini Business", cat:"monthly", price:1200, sub:1000, color:"#8B5CF6",
    headline:"Articol publicitar + promovare social media",
    inc:[{w:"1 articol publicitar pe site",d:"Scris de tine sau de redactia noastra"},{w:"Prima pagina 7 zile",d:"Vizibil tuturor vizitatorilor"},{w:"4 postari/luna FB + IG",d:"Promovare articol"},{w:"2 story-uri/luna",d:"Facebook + Instagram"}],
    delivery:"Publicat in max 5 zile lucratoare", hasArticle:true },
  { id:"advertorial", name:"Advertorial Complet", cat:"monthly", price:1800, sub:1500, color:C.amber, pop:true,
    headline:"Articol de calitate pe prima pagina + promovare completa",
    inc:[{w:"1 articol advertorial profesional",d:"Redactat de echipa sau furnizat de tine"},{w:"Prima pagina 30 de zile",d:"Cea mai citita publicatie din Sibiu"},{w:"4 postari/luna FB + IG",d:"Design profesional + link"},{w:"2 story-uri/luna",d:"Reach suplimentar"},{w:"Programare publicare",d:"Tu decizi cand apare"},{w:"Aprobare inainte",d:"Primesti articolul pentru review"}],
    delivery:"Gata in 3-5 zile. Tu alegi data.", hasArticle:true },
  { id:"banner", name:"Banner pe Site", cat:"monthly", price:1800, sub:1500, color:"#06B6D4",
    headline:"1.5 milioane de afisari lunare pe oradesibiu.ro",
    inc:[{w:"Banner 300x250 px",d:"Desktop + mobil"},{w:"~1.5M afisari/luna",d:"Trafic auditat BRAT"},{w:"Redirect la click",d:"Site, FB, telefon, WhatsApp"},{w:"Statistici real-time",d:"Afisari si click-uri"}],
    delivery:"Activ in 24h", hasArticle:false },
  { id:"premium", name:"Premium 360°", cat:"monthly", price:3000, sub:2500, color:C.green,
    headline:"Tot ce ai nevoie: articol + banner + social + push + newsletter",
    inc:[{w:"Banner desktop + mobil",d:"1.5M afisari"},{w:"Articol advertorial 30 zile",d:"Redactat profesional"},{w:"8 postari/luna FB + IG",d:"Dublu fata de standard"},{w:"4 story-uri/luna",d:""},{w:"Push 15.000 abonati",d:""},{w:"Newsletter 600 abonati",d:""},{w:"Promovare TikTok",d:"24k urmaritori"},{w:"Raport detaliat",d:"Toate canalele"}],
    delivery:"Setup complet in 5 zile", hasArticle:true },
];

const AD_CAT = [
  {id:"aviz-mediu",label:"Aviz de mediu",icon:"🌿"},{id:"pierderi",label:"Pierderi / Gasiri",icon:"🔍"},
  {id:"decese",label:"Decese / Comemorari",icon:"🕯️"},{id:"autorizatii",label:"Autorizatii / Licitatii",icon:"📋"},
  {id:"citare",label:"Citari / Somare",icon:"⚖️"},{id:"diverse",label:"Diverse",icon:"📌"},
];

/* ═══ UTILS ═══ */
function gid(){return Date.now().toString(36)+Math.random().toString(36).substr(2,5)}

function sld(k, fb) {
  try {
    const r = localStorage.getItem(k);
    return Promise.resolve(r ? JSON.parse(r) : fb);
  } catch {
    return Promise.resolve(fb);
  }
}

function ssv(k, d) {
  try {
    localStorage.setItem(k, JSON.stringify(d));
  } catch(e) {
    console.error(e);
  }
  return Promise.resolve();
}

function calcAd(w,d){let p=50;if(w>250)p=75;if(w>500)p=100;if(w>750)p=125;if(w>1000)p=150;let disc=0;if(d>=4)disc=.10;if(d>=8)disc=.15;if(d>=15)disc=.20;if(d>=30)disc=.25;const a=Math.round(p*(1-disc));return{p,disc,a,total:a*d}}

async function lookupCUI(cui){
  const c=cui.toString().replace(/\D/g,"");if(!c||c.length<2)return null;
  const body=JSON.stringify([{cui:parseInt(c),data:new Date().toISOString().split("T")[0]}]);
  for(const url of["https://webservicesp.anaf.ro/PlatitorTvaRest/api/v8/ws/tva","https://corsproxy.io/?"+encodeURIComponent("https://webservicesp.anaf.ro/PlatitorTvaRest/api/v8/ws/tva")]){
    try{const r=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body});const d=await r.json();
      if(d.cod===200&&d.found?.length>0){const f=d.found[0];return{company:f.denumire||"",address:f.adresa||"",regCom:f.nrRegCom||"",vat:f.scpTVA===true}}}catch{continue}}
  return null;
}

async function callAI(sys, usr) {
  try {
    const r = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system: sys, user: usr }),
    });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const d = await r.json();
    return d.text || null;
  } catch {
    return null;
  }
}

async function wpUploadImage(file){
  if(!WP.user||!WP.pass)return null;
  const fd=new FormData();fd.append("file",file,file.name);
  try{const r=await fetch(WP.url+WP.rest+"/media",{method:"POST",headers:{"Authorization":"Basic "+btoa(WP.user+":"+WP.pass)},body:fd});
    if(!r.ok)throw new Error("HTTP "+r.status);const d=await r.json();return{id:d.id,url:d.source_url}}catch(e){console.error("WP upload:",e);return null}
}

async function wpCreateDraft(data){
  if(!WP.user||!WP.pass)return{success:false,error:"no-config"};
  try{
    let catId=null;
    try{const cr=await fetch(WP.url+WP.rest+"/categories?slug=advertorial",{headers:{"Authorization":"Basic "+btoa(WP.user+":"+WP.pass)}});
      const cats=await cr.json();if(cats.length>0)catId=cats[0].id}catch{}
    const body={title:data.title,content:data.content,status:"draft",categories:catId?[catId]:[]};
    if(data.featuredImage)body.featured_media=data.featuredImage;
    body.content="<!-- wp:paragraph --><p><em>Publicitate</em></p><!-- /wp:paragraph -->"+body.content;
    const r=await fetch(WP.url+WP.rest+"/posts",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Basic "+btoa(WP.user+":"+WP.pass)},body:JSON.stringify(body)});
    if(!r.ok)throw new Error("HTTP "+r.status);const res=await r.json();return{success:true,id:res.id,link:res.link}
  }catch(e){return{success:false,error:e.message}}
}

/* ═══ STYLES ═══ */
const inp={width:"100%",padding:"13px 16px",border:"2px solid "+C.g200,borderRadius:10,fontSize:15,boxSizing:"border-box",fontFamily:"'Source Sans 3',sans-serif",background:C.white,color:C.navy,lineHeight:1.5};
const lab={fontSize:11.5,fontWeight:700,color:C.g600,marginBottom:5,display:"block",textTransform:"uppercase",letterSpacing:1};
const btn={padding:"14px 30px",background:C.amber,color:C.navy,border:"none",borderRadius:12,cursor:"pointer",fontWeight:800,fontSize:15,fontFamily:"'Source Sans 3',sans-serif",letterSpacing:.2};
const btn2={...btn,background:C.g100,color:C.g700,fontWeight:600,fontSize:14};

/* ═══ CUI ═══ */
function CUI({value,onChange,onData}){
  const[l,setL]=useState(false);const[s,setS]=useState(null);
  const go=async()=>{if(!value||value.replace(/\D/g,"").length<2)return;setL(true);setS(null);const d=await lookupCUI(value);setL(false);if(d){setS("ok");onData(d)}else setS("err")};
  return(<div><label style={lab}>CUI / Cod Fiscal</label><div style={{display:"flex",gap:8}}>
    <input style={{...inp,flex:1}} value={value} onChange={e=>{onChange(e.target.value);setS(null)}} placeholder="ex: 39899930" onKeyDown={e=>e.key==="Enter"&&go()}/>
    <button onClick={go} disabled={l} style={{...btn,padding:"11px 18px",background:C.navy,color:C.white,fontSize:13,whiteSpace:"nowrap",opacity:l?0.6:1}}>{l?"...":"ANAF"}</button>
  </div>{s==="ok"&&<div style={{fontSize:12,color:C.green,marginTop:4,fontWeight:600}}>✓ Date preluate</div>}{s==="err"&&<div style={{fontSize:12,color:C.red,marginTop:4}}>CUI negasit</div>}</div>);
}

/* ═══ IMAGE UPLOADER ═══ */
function ImageUp({label,images,onChange,multi}){
  const ref=useRef();
  const handleFiles=(files)=>{
    Array.from(files).forEach(file=>{
      if(!file.type.startsWith("image/"))return;
      const reader=new FileReader();
      reader.onload=e=>{
        const img={id:gid(),name:file.name,data:e.target.result,file:file};
        onChange(multi?[...images,img]:[img]);
      };
      reader.readAsDataURL(file);
    });
  };
  return(
    <div>
      <label style={lab}>{label}</label>
      <div onClick={()=>ref.current?.click()} className="img-dropzone" style={{border:"2px dashed "+C.g200,borderRadius:14,padding:images.length>0?14:32,cursor:"pointer",textAlign:"center",background:C.g50,minHeight:64}}>
        {images.length===0&&<div><div style={{fontSize:24,color:C.g400}}>📷</div><div style={{fontSize:12,color:C.g400,marginTop:4}}>Click pentru a adauga {multi?"fotografii":"fotografia principala"}</div></div>}
        {images.length>0&&(
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {images.map((img,i)=>(
              <div key={img.id} style={{position:"relative",width:80,height:80,borderRadius:8,overflow:"hidden",border:"2px solid "+C.g200}}>
                <img src={img.data} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>
                <div onClick={e=>{e.stopPropagation();onChange(images.filter((_,j)=>j!==i))}} style={{position:"absolute",top:2,right:2,width:20,height:20,borderRadius:"50%",background:"rgba(0,0,0,.6)",color:C.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,cursor:"pointer"}}>×</div>
              </div>
            ))}
            {multi&&<div style={{width:80,height:80,borderRadius:8,border:"2px dashed "+C.g200,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,color:C.g400}}>+</div>}
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" multiple={multi} style={{display:"none"}} onChange={e=>handleFiles(e.target.files)}/>
    </div>
  );
}

/* ═══ QUICK BUY ═══ */
function QuickBuy({pkg,onClose,onDone}){
  const[pay,setPay]=useState("proforma");
  const[f,sF]=useState({name:"",company:"",cui:"",address:"",phone:"",email:"",sub:false});
  const set=(k,v)=>sF(s=>({...s,[k]:v}));
  const price=f.sub&&pkg.sub?pkg.sub:pkg.price,tva=Math.round(price*.19),total=price+tva;
  const hCUI=d=>sF(s=>({...s,company:d.company||s.company,address:d.address||s.address}));
  const submit=async()=>{if(!f.name||!f.phone||!f.email)return;
    const order={id:gid(),...f,packageId:pkg.id,packageName:pkg.name,price,payMethod:pay,date:new Date().toISOString(),subscription:f.sub,
      status:"paid",contentChoice:null,articleTitle:"",articleText:"",featuredImg:null,gallery:[],reposts:[],wpDraftId:null,wpDraftUrl:null,
      stats:{views:0,clicks:0,shares:0,fbReach:0,igReach:0}};
    const ex=await sld("ods-orders",[]);await ssv("ods-orders",[order,...ex]);onDone(order)};

  return(<div style={{position:"fixed",inset:0,background:"rgba(10,22,40,.78)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16,backdropFilter:"blur(6px)"}} onClick={onClose}>
    <div style={{background:C.white,borderRadius:24,width:"100%",maxWidth:480,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,.28)"}} onClick={e=>e.stopPropagation()}>
      <div style={{padding:28}}>
        <div style={{background:"linear-gradient(135deg,"+pkg.color+"18,"+pkg.color+"08)",borderRadius:16,padding:20,marginBottom:22,borderLeft:"5px solid "+pkg.color}}>
          <h3 style={{margin:"0 0 6px",fontFamily:"'Playfair Display',Georgia,serif",fontSize:21,color:C.navy,fontWeight:900}}>{pkg.name}</h3>
          <div style={{display:"flex",alignItems:"baseline",gap:6}}><span style={{fontSize:36,fontWeight:900,color:C.navy,fontFamily:"'Playfair Display',Georgia,serif"}}>{price.toLocaleString("ro")}</span><span style={{fontSize:14,color:C.g400}}>lei + TVA{pkg.cat!=="oneTime"?" / lună":""}</span></div>
          {pkg.sub&&<div style={{fontSize:13,color:C.green,fontWeight:700,marginTop:8,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:6,background:C.greenBg,padding:"5px 12px",borderRadius:8,border:"1px solid #A7F3D0"}} onClick={()=>set("sub",!f.sub)}>{f.sub?"✓ Abonament: "+pkg.sub.toLocaleString("ro")+" lei/lună":"💡 Economisești "+((pkg.price-pkg.sub)*3).toLocaleString("ro")+" lei la abonament"}</div>}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <CUI value={f.cui} onChange={v=>set("cui",v)} onData={hCUI}/>
          <div><label style={lab}>Companie</label><input style={inp} value={f.company} onChange={e=>set("company",e.target.value)}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div><label style={lab}>Nume *</label><input style={inp} value={f.name} onChange={e=>set("name",e.target.value)}/></div>
            <div><label style={lab}>Telefon *</label><input style={inp} value={f.phone} onChange={e=>set("phone",e.target.value)}/></div>
          </div>
          <div><label style={lab}>Email * <span style={{fontWeight:400,textTransform:"none",letterSpacing:0,color:C.g400,fontSize:11}}>(primești accesul la dashboard)</span></label><input style={inp} value={f.email} onChange={e=>set("email",e.target.value)}/></div>
          <div style={{marginTop:4}}>
            {[{id:"proforma",l:"🏦 Transfer bancar (proforma)"},{id:"card",l:"💳 Plată cu cardul"}].map(m=>(
              <label key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",marginBottom:6,background:pay===m.id?"#EFF6FF":C.g50,border:"2px solid "+(pay===m.id?C.blue:C.g200),borderRadius:12,cursor:"pointer",transition:"all .15s ease"}}>
                <input type="radio" name="p" checked={pay===m.id} onChange={()=>setPay(m.id)} style={{accentColor:C.blue,width:16,height:16}}/><span style={{fontWeight:700,fontSize:14,color:C.navy}}>{m.l}</span>
              </label>))}
          </div>
          <div style={{background:"linear-gradient(135deg,"+C.navy+","+C.navy2+")",borderRadius:16,padding:"18px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4}}>
            <div><div style={{fontSize:12,color:C.g400,marginBottom:2}}>Total de plată:</div><div style={{fontSize:28,fontWeight:900,color:C.amber,fontFamily:"'Playfair Display',Georgia,serif"}}>{total.toLocaleString("ro")} lei</div></div>
            <button onClick={submit} disabled={!f.name||!f.phone||!f.email} style={{...btn,padding:"15px 28px",fontSize:16,fontWeight:900,opacity:(!f.name||!f.phone||!f.email)?0.4:1}}>{pay==="card"?"Plătește":"Cumpără"}</button>
          </div>
          <div style={{fontSize:12,color:C.g400,textAlign:"center",lineHeight:1.6}}>După plată primești dashboard-ul cu toți pașii următori.</div>
        </div>
        <button onClick={onClose} style={{...btn2,width:"100%",marginTop:10,padding:"11px 0",fontSize:13}}>Anulează</button>
      </div>
    </div>
  </div>);
}

/* ═══ CLIENT DASHBOARD ═══ */
function Dashboard({initOrder,onBack}){
  const[order,setOrder]=useState(initOrder);
  const[repostDay,setRD]=useState("");
  const[repostTime,setRT]=useState("orice");
  const[wpLoading,setWpL]=useState(false);
  const[wpMsg,setWpMsg]=useState(null);
  const pkg=PKG.find(p=>p.id===order.packageId);

  const upd=async(changes)=>{const u={...order,...changes};setOrder(u);
    const all=await sld("ods-orders",[]);await ssv("ods-orders",all.map(o=>o.id===u.id?u:o))};

  const submitToWP=async()=>{
    if(!order.articleTitle||!order.articleText){setWpMsg("Completati titlul si textul articolului.");return}
    setWpL(true);setWpMsg(null);
    let featId=null;
    if(order.featuredImg?.[0]?.file){
      const res=await wpUploadImage(order.featuredImg[0].file);
      if(res)featId=res.id;
    }
    let galleryHtml="";
    for(const img of(order.gallery||[])){
      if(img.file){const res=await wpUploadImage(img.file);if(res)galleryHtml+=`<!-- wp:image --><figure class="wp-block-image"><img src="${res.url}" alt=""/></figure><!-- /wp:image -->`}
    }
    const content=order.articleText.split("\n").filter(p=>p.trim()).map(p=>`<!-- wp:paragraph --><p>${p}</p><!-- /wp:paragraph -->`).join("")+galleryHtml;
    const result=await wpCreateDraft({title:order.articleTitle,content,featuredImage:featId});
    setWpL(false);
    if(result.success){setWpMsg("ok");upd({wpDraftId:result.id,wpDraftUrl:result.link,status:"review"})}
    else if(result.error==="no-config"){setWpMsg("config")}
    else{setWpMsg("Eroare: "+result.error)}
  };

  const STEPS=[{l:"Plata confirmata",done:true},{l:pkg?.hasArticle?"Continut trimis":"Materiale primite",done:!!order.contentChoice},{l:"In lucru",done:order.status==="review"||order.status==="published"},{l:"Publicat",done:order.status==="published"}];

  return(
    <div style={{maxWidth:900,margin:"0 auto"}}>
      <div style={{background:"linear-gradient(135deg,"+C.navy+","+C.navy2+")",borderRadius:22,padding:"28px 32px",color:C.white,marginBottom:20,boxShadow:"0 8px 32px rgba(10,22,40,.2)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
          <div>
            <div style={{fontSize:11,color:C.amber,fontWeight:800,textTransform:"uppercase",letterSpacing:1.5,marginBottom:6}}>Dashboard Client</div>
            <h2 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:26,margin:"0 0 6px",fontWeight:900}}>{order.company||order.name}</h2>
            <div style={{fontSize:14,color:C.g400}}>Pachet: <strong style={{color:C.white}}>{pkg?.name}</strong></div>
          </div>
          <button onClick={onBack} style={{...btn2,background:"rgba(255,255,255,.1)",color:"#CBD5E1",padding:"10px 18px",fontSize:13,border:"1px solid rgba(255,255,255,.12)",transform:"none",boxShadow:"none",filter:"none"}}>← Înapoi</button>
        </div>
      </div>

      <div style={{background:C.white,borderRadius:18,padding:"24px 28px",marginBottom:16,boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
        <div style={{display:"flex",gap:0}}>
          {STEPS.map((s,i)=>(
            <div key={i} style={{flex:1,textAlign:"center",position:"relative"}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:s.done?"linear-gradient(135deg,"+C.green+",#059669)":C.g100,color:s.done?C.white:C.g400,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 6px",fontSize:14,fontWeight:800,boxShadow:s.done?"0 4px 12px rgba(5,150,105,.3)":"none"}}>{s.done?"✓":(i+1)}</div>
              <div style={{fontSize:11,fontWeight:700,color:s.done?C.green:C.g400,letterSpacing:.3}}>{s.l}</div>
              {i<STEPS.length-1&&<div style={{position:"absolute",top:18,left:"50%",width:"100%",height:2,background:STEPS[i+1]?.done?C.green:C.g200,zIndex:0,borderRadius:2}}/>}
            </div>))}
        </div>
      </div>

      {pkg?.hasArticle&&(
        <div style={{background:C.white,borderRadius:16,padding:24,marginBottom:16}}>
          <h3 style={{margin:"0 0 16px",fontSize:18,fontWeight:800,color:C.navy}}>Conținutul articolului</h3>
          {!order.contentChoice?(
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <button onClick={()=>upd({contentChoice:"redactor",status:"review"})} style={{...btn,flex:1,minWidth:200,padding:18,background:C.amber,textAlign:"left",borderRadius:14}}>
                <div style={{fontWeight:800,fontSize:15}}>Vreau un redactor</div>
                <div style={{fontSize:12,fontWeight:400,opacity:.8,marginTop:4}}>Veti fi contactat de un redactor pentru a discuta detaliile articolului</div>
              </button>
              <button onClick={()=>upd({contentChoice:"propriu"})} style={{...btn2,flex:1,minWidth:200,padding:18,textAlign:"left",borderRadius:14,border:"1.5px solid "+C.g200}}>
                <div style={{fontWeight:700,fontSize:15,color:C.navy}}>Trimit eu materialele</div>
                <div style={{fontSize:12,color:C.g400,marginTop:4}}>Scriu textul si incarc pozele chiar aici, in dashboard</div>
              </button>
            </div>
          ):order.contentChoice==="redactor"?(
            <div style={{background:"#FFFBEB",borderRadius:12,padding:16,border:"1px solid #FDE68A"}}>
              <div style={{fontSize:14,fontWeight:700,color:C.navy,marginBottom:4}}>✍️ Un redactor va scrie articolul</div>
              <div style={{fontSize:13,color:C.g600}}>Veti fi contactat de un redactor la numarul <strong>{order.phone}</strong> in urmatoarele 24h pentru a discuta detaliile articolului.</div>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div>
                <label style={lab}>Titlul articolului *</label>
                <input style={{...inp,fontSize:16,fontWeight:700}} value={order.articleTitle||""} onChange={e=>upd({articleTitle:e.target.value})} placeholder="Ex: Restaurant La Cuptor - Meniu nou de primavara in Sibiu"/>
              </div>
              <div>
                <label style={lab}>Textul articolului *</label>
                <textarea value={order.articleText||""} onChange={e=>upd({articleText:e.target.value})}
                  placeholder={"Scrieti sau lipiti textul articolului aici.\n\nFiecare paragraf va fi separat automat.\nPuteti include detalii despre afacerea dvs., oferte speciale, adresa, program, etc."}
                  style={{...inp,minHeight:200,resize:"vertical",lineHeight:1.7}}/>
                <div style={{fontSize:11,color:C.g400,marginTop:4}}>{(order.articleText||"").trim().split(/\s+/).filter(Boolean).length} cuvinte</div>
              </div>
              <ImageUp label="Fotografie principala (cover)" images={order.featuredImg||[]} onChange={imgs=>upd({featuredImg:imgs})} multi={false}/>
              <ImageUp label="Galerie foto (optional)" images={order.gallery||[]} onChange={imgs=>upd({gallery:imgs})} multi={true}/>
              <button onClick={submitToWP} disabled={wpLoading||!order.articleTitle||!order.articleText}
                style={{...btn,width:"100%",padding:14,fontSize:15,background:C.navy,color:C.white,opacity:(!order.articleTitle||!order.articleText)?0.4:1}}>
                {wpLoading?"Se trimite...":"Trimite articolul spre publicare"}
              </button>
              {wpMsg==="ok"&&<div style={{padding:12,background:C.greenBg,borderRadius:10,fontSize:13,color:C.green,fontWeight:600}}>✓ Articolul a fost trimis ca draft in WordPress! Echipa il va revizui si publica.</div>}
              {wpMsg==="config"&&<div style={{padding:12,background:"#FEF3C7",borderRadius:10,fontSize:13,color:"#92400E"}}>Articolul a fost salvat local. Configurati WP_USER + WP_PASS in variabilele de mediu pentru publicare automata.</div>}
              {wpMsg&&wpMsg!=="ok"&&wpMsg!=="config"&&<div style={{padding:12,background:"#FEE2E2",borderRadius:10,fontSize:13,color:C.red}}>{wpMsg}</div>}
              {order.wpDraftUrl&&<div style={{padding:12,background:C.greenBg,borderRadius:10,fontSize:13}}>🎉 Draft creat: <a href={order.wpDraftUrl} target="_blank" rel="noopener" style={{color:C.blue}}>{order.wpDraftUrl}</a></div>}
            </div>
          )}
        </div>
      )}

      <div style={{background:C.white,borderRadius:16,padding:24,marginBottom:16}}>
        <h3 style={{margin:"0 0 10px",fontSize:18,fontWeight:800,color:C.navy}}>Calendar postări sociale</h3>
        <p style={{margin:"0 0 14px",fontSize:13,color:C.g400,lineHeight:1.5}}>Alege zilele și ora la care vrei să fie publicate postările pe Facebook și Instagram:</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
          {(order.reposts||[]).map((entry,i)=>{
            const parts=entry.split("|");const dateStr=parts[0];const timeStr=parts[1]||"orice";
            const dateLabel=new Date(dateStr).toLocaleDateString("ro-RO");
            const timeLabel=timeStr==="orice"?"orice ora":timeStr;
            return(
              <span key={i} style={{background:C.blue+"18",color:C.blue,padding:"5px 12px",borderRadius:20,fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
                {dateLabel} la {timeLabel}
                <span style={{cursor:"pointer",fontWeight:800,marginLeft:2}} onClick={()=>upd({reposts:(order.reposts||[]).filter((_,j)=>j!==i)})}>×</span>
              </span>);
          })}
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"flex-end"}}>
          <div style={{flex:"1 1 140px"}}>
            <label style={lab}>Data</label>
            <input type="date" value={repostDay} onChange={e=>setRD(e.target.value)} min={new Date().toISOString().split("T")[0]} style={inp}/>
          </div>
          <div style={{flex:"0 0 130px"}}>
            <label style={lab}>Ora</label>
            <select value={repostTime} onChange={e=>setRT(e.target.value)} style={inp}>
              <option value="orice">Orice ora</option>
              {Array.from({length:15},(_,i)=>i+7).map(h=>{
                const hh=String(h).padStart(2,"0")+":00";
                return <option key={h} value={hh}>{hh}</option>
              })}
            </select>
          </div>
          <button onClick={()=>{if(repostDay){upd({reposts:[...(order.reposts||[]),repostDay+"|"+repostTime]});setRD("");setRT("orice")}}} disabled={!repostDay} style={{...btn,padding:"11px 18px",background:C.navy,color:C.white,fontSize:13,opacity:repostDay?1:0.4}}>Adauga</button>
        </div>
      </div>

      <div style={{background:C.white,borderRadius:16,padding:24,marginBottom:16}}>
        <h3 style={{margin:"0 0 14px",fontSize:18,fontWeight:800,color:C.navy}}>Statistici</h3>
        {order.status!=="published"?(
          <div style={{textAlign:"center",padding:20,color:C.g400}}><div style={{fontSize:32,marginBottom:8}}>📊</div><div style={{fontSize:13}}>Statisticile apar dupa publicare</div></div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:10}}>
            {[{l:"Vizualizari",v:order.stats.views,c:C.navy},{l:"Click-uri",v:order.stats.clicks,c:C.amber},{l:"Distribuiri",v:order.stats.shares,c:C.green},{l:"Reach FB",v:order.stats.fbReach,c:C.blue},{l:"Reach IG",v:order.stats.igReach,c:"#E1306C"}].map((s,i)=>(
              <div key={i} style={{background:C.g50,borderRadius:10,padding:12,textAlign:"center"}}>
                <div style={{fontSize:20,fontWeight:800,color:s.c}}>{s.v.toLocaleString("ro")}</div>
                <div style={{fontSize:10,color:C.g400}}>{s.l}</div>
              </div>))}
          </div>)}
      </div>

      <div style={{background:C.white,borderRadius:16,padding:"18px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,border:"1.5px solid "+C.g100,boxShadow:"0 2px 10px rgba(0,0,0,.05)"}}>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:C.navy,marginBottom:2}}>Ai întrebări?</div>
          <div style={{fontSize:13,color:C.g600}}>Contactează-ne la <strong style={{color:C.navy}}>{ODS.phone}</strong> prin WhatsApp</div>
        </div>
        <a href={"https://wa.me/40746752240?text=Salut,+comanda+"+order.id.toUpperCase()} target="_blank" rel="noopener" style={{...btn,padding:"11px 22px",background:C.green,color:C.white,textDecoration:"none",fontSize:14,fontWeight:800}}>💬 WhatsApp</a>
      </div>
    </div>
  );
}

/* ═══ ANUNTURI (MICA PUBLICITATE) ═══ */
function AnunturiView({onBuyAd}){
  const[cat,setCat]=useState("");const[text,setText]=useState("");const[days,setDays]=useState(1);
  const[ai,setAi]=useState(false);const[aiOk,setAiOk]=useState(null);
  const words=text.trim()?text.trim().split(/\s+/).length:0;
  const pr=calcAd(words,days);const canOrd=cat&&words>=3&&words<=1200;
  const enhance=async()=>{if(!text.trim()||!cat)return;setAi(true);setAiOk(null);
    const r=await callAI("Esti redactor oradesibiu.ro. Imbunatateste anuntul. Corecteaza greseli. NU inventa. DOAR textul. Romana.","Tip: "+(AD_CAT.find(c=>c.id===cat)?.label||"")+"\n\n"+text);
    setAi(false);if(r){setText(r);setAiOk(true)}else setAiOk(false)};

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div><label style={{...lab,fontSize:12}}>1. Tipul anunțului</label>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginTop:8}}>
          {AD_CAT.map(c=>(
            <button key={c.id} onClick={()=>setCat(c.id)} className="ad-cat-btn" style={{padding:"16px 14px",borderRadius:14,border:cat===c.id?"2px solid "+C.amber:"2px solid "+C.g200,background:cat===c.id?"#FFFBEB":C.white,cursor:"pointer",textAlign:"left",fontFamily:"'Source Sans 3',sans-serif",boxShadow:cat===c.id?"0 4px 14px rgba(245,158,11,.2)":"none"}}>
              <div style={{fontSize:26,marginBottom:6}}>{c.icon}</div>
              <div style={{fontSize:14,fontWeight:700,color:cat===c.id?C.navy:C.g600,lineHeight:1.3}}>{c.label}</div>
            </button>))}
        </div>
      </div>

      <div><div style={{display:"flex",justifyContent:"space-between"}}><label style={{...lab,fontSize:12}}>2. Textul anuntului</label>
        <span style={{fontSize:12,fontWeight:700,color:words>1200?C.red:words>250?C.amber:C.green}}>{words} cuvinte</span></div>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Scrieti textul anuntului..." style={{...inp,minHeight:150,resize:"vertical",lineHeight:1.7,marginTop:6}}/>
        <div style={{display:"flex",gap:8,alignItems:"center",marginTop:6}}>
          <button onClick={enhance} disabled={ai||!text.trim()||words<5} style={{...btn,padding:"8px 16px",fontSize:12,background:ai?C.g200:C.navy,color:ai?C.g400:C.white,opacity:(!text.trim()||words<5)?0.4:1}}>{ai?"...":"✨ Imbunatateste cu AI"}</button>
          {aiOk===true&&<span style={{fontSize:12,color:C.green,fontWeight:600}}>Imbunatatit!</span>}
          {aiOk===false&&<span style={{fontSize:12,color:C.red}}>AI indisponibil momentan</span>}
        </div>
      </div>

      <div><label style={{...lab,fontSize:12}}>3. Durata</label>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:8}}>
          {[1,3,5,7,14,30].map(d=>(
            <button key={d} onClick={()=>setDays(d)} className="dur-btn" style={{padding:"11px 20px",borderRadius:10,border:days===d?"2px solid "+C.navy:"2px solid "+C.g200,background:days===d?C.navy:C.white,fontWeight:800,fontSize:14,color:days===d?C.white:C.g600,cursor:"pointer",fontFamily:"'Source Sans 3',sans-serif"}}>{d} {d===1?"zi":"zile"}</button>))}
          <input type="number" min={1} max={90} value={days} onChange={e=>setDays(Math.max(1,Math.min(90,Number(e.target.value))))} style={{...inp,width:80,textAlign:"center"}}/>
        </div>
        {pr.disc>0&&<div style={{fontSize:13,color:C.green,fontWeight:700,marginTop:6,display:"inline-flex",alignItems:"center",gap:4,background:C.greenBg,padding:"4px 10px",borderRadius:8}}>🎁 Discount {Math.round(pr.disc*100)}%</div>}
      </div>

      <div style={{background:C.white,borderRadius:18,padding:"22px 24px",border:"1.5px solid "+C.g200,boxShadow:"0 4px 16px rgba(0,0,0,.06)"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <span style={{fontSize:15,fontWeight:700,color:C.navy}}>Total de plată:</span>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:34,fontWeight:900,color:C.amber,fontFamily:"'Playfair Display',Georgia,serif",lineHeight:1}}>{pr.total.toLocaleString("ro")} lei</div>
            <div style={{fontSize:12,color:C.g400,marginTop:3}}>+ TVA = {Math.round(pr.total*1.19).toLocaleString("ro")} lei &nbsp;·&nbsp; {pr.a} lei/zi × {days} zile</div>
          </div>
        </div>
        <button onClick={()=>onBuyAd({cat:AD_CAT.find(c=>c.id===cat),text,words,days,pr})} disabled={!canOrd} style={{...btn,width:"100%",padding:"15px 0",fontSize:16,fontWeight:900,opacity:canOrd?1:0.4}}>Plasează anunțul</button>
      </div>
    </div>
  );
}

/* ═══ AD CHECKOUT ═══ */
function AdCheckout({ad,onClose}){
  const[step,setStep]=useState(1);const[pay,setPay]=useState("proforma");
  const[f,sF]=useState({name:"",company:"",cui:"",phone:"",email:""});
  const[v,sV]=useState({terms:false,accurate:false,sent:false,code:"",real:"",ok:false});
  const set=(k,val)=>sF(s=>({...s,[k]:val}));
  const tva=Math.round(ad.pr.total*.19),total=ad.pr.total+tva;
  const hCUI=d=>sF(s=>({...s,company:d.company||s.company}));
  const sendCode=()=>{const c=String(Math.floor(1000+Math.random()*9000));sV(x=>({...x,sent:true,real:c}));alert("DEMO: Codul SMS este "+c)};
  const canGo=v.terms&&v.accurate&&v.ok&&f.name&&f.phone;
  const submit=async()=>{if(!canGo)return;
    const order={id:gid(),...f,packageId:"anunt-"+ad.cat.id,packageName:"Anunt: "+ad.cat.label+" ("+ad.days+"z)",price:ad.pr.total,payMethod:pay,date:new Date().toISOString(),isAnunt:true,anuntText:ad.text,anuntDays:ad.days,anuntWords:ad.words,verified:true,converted:false};
    const ex=await sld("ods-orders",[]);await ssv("ods-orders",[order,...ex]);setStep(3)};

  return(<div style={{position:"fixed",inset:0,background:"rgba(10,22,40,.78)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:16,backdropFilter:"blur(6px)"}} onClick={onClose}>
    <div style={{background:C.white,borderRadius:24,width:"100%",maxWidth:500,maxHeight:"92vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,.28)"}} onClick={e=>e.stopPropagation()}>
      {step===3?(
        <div style={{padding:40,textAlign:"center"}}>
          <div style={{width:64,height:64,background:"linear-gradient(135deg,"+C.green+",#059669)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px",fontSize:30,color:C.white,boxShadow:"0 8px 24px rgba(5,150,105,.3)"}}>✓</div>
          <h3 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:22,margin:"0 0 10px",color:C.navy,fontWeight:900}}>Anunț verificat și înregistrat!</h3>
          <p style={{color:C.g400,fontSize:15,lineHeight:1.6}}>Va fi publicat în max 24h de la confirmarea plății.</p>
          <button onClick={onClose} style={{...btn,marginTop:20,fontSize:15,padding:"14px 32px"}}>Închide</button>
        </div>
      ):(<div style={{padding:28}}>
        <h3 style={{margin:"0 0 18px",fontFamily:"'Playfair Display',Georgia,serif",fontSize:20,color:C.navy,fontWeight:900}}>{ad.cat.icon} {ad.cat.label}</h3>
        {step===1&&(<div style={{display:"flex",flexDirection:"column",gap:12}}>
          <CUI value={f.cui} onChange={val=>set("cui",val)} onData={hCUI}/>
          <div><label style={lab}>Companie / Persoană</label><input style={inp} value={f.company} onChange={e=>set("company",e.target.value)}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div><label style={lab}>Nume *</label><input style={inp} value={f.name} onChange={e=>set("name",e.target.value)}/></div>
            <div><label style={lab}>Telefon *</label><input style={inp} value={f.phone} onChange={e=>set("phone",e.target.value)}/></div>
          </div>
          <div style={{background:"#FFFBEB",borderRadius:14,padding:16,border:"1px solid #FDE68A"}}>
            <div style={{fontSize:13,fontWeight:800,color:"#92400E",marginBottom:10}}>Verificare identitate</div>
            <label style={{display:"flex",gap:10,marginBottom:8,cursor:"pointer",fontSize:13,color:"#78350F",alignItems:"flex-start"}}><input type="checkbox" checked={v.accurate} onChange={e=>sV(x=>({...x,accurate:e.target.checked}))} style={{accentColor:C.navy,marginTop:2,width:15,height:15}}/>Declar că informațiile sunt reale și corecte.</label>
            <label style={{display:"flex",gap:10,marginBottom:10,cursor:"pointer",fontSize:13,color:"#78350F",alignItems:"flex-start"}}><input type="checkbox" checked={v.terms} onChange={e=>sV(x=>({...x,terms:e.target.checked}))} style={{accentColor:C.navy,marginTop:2,width:15,height:15}}/>Accept termenii și condițiile ODS SRL.</label>
            <div style={{borderTop:"1px solid #FDE68A",paddingTop:10}}>
              <div style={{fontSize:12,fontWeight:800,color:"#92400E",marginBottom:6}}>Verificare telefon (SMS)</div>
              {!v.ok?(<div style={{display:"flex",gap:8}}>
                {!v.sent?<button onClick={sendCode} disabled={!f.phone||f.phone.replace(/\D/g,"").length<10} style={{...btn,padding:"9px 16px",fontSize:13,background:C.navy,color:C.white,opacity:(!f.phone||f.phone.replace(/\D/g,"").length<10)?0.4:1}}>Trimite cod SMS</button>
                :<><input value={v.code} onChange={e=>sV(x=>({...x,code:e.target.value}))} maxLength={4} placeholder="Cod" style={{...inp,width:110,textAlign:"center",fontSize:18,fontWeight:800,letterSpacing:6}}/>
                  <button onClick={()=>sV(x=>({...x,ok:x.code===x.real}))} style={{...btn,padding:"9px 18px",fontSize:13,background:C.navy,color:C.white}}>Verifică</button></>}
              </div>):<div style={{fontSize:13,color:C.green,fontWeight:800,display:"flex",alignItems:"center",gap:6}}>✓ Telefon verificat</div>}
            </div>
          </div>
          <button onClick={()=>{if(canGo)setStep(2)}} disabled={!canGo} style={{...btn,width:"100%",padding:"14px 0",fontSize:16,fontWeight:900,opacity:canGo?1:0.4}}>Continuă →</button>
        </div>)}
        {step===2&&(<div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:C.g50,borderRadius:12,padding:16,border:"1px solid "+C.g200}}>
            <div style={{fontSize:13,color:C.g600,fontStyle:"italic",maxHeight:56,overflowY:"auto",lineHeight:1.6}}>{ad.text.substring(0,200)}{ad.text.length>200?"...":""}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
              <span style={{fontSize:13,color:C.g400}}>{ad.words} cuv × {ad.days} zile</span>
              <span style={{fontSize:22,fontWeight:900,color:C.amber,fontFamily:"'Playfair Display',Georgia,serif"}}>{total.toLocaleString("ro")} lei</span>
            </div>
          </div>
          {[{id:"proforma",l:"🏦 Transfer bancar"},{id:"card",l:"💳 Plată cu cardul"}].map(m=>(
            <label key={m.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",background:pay===m.id?"#EFF6FF":C.g50,border:"2px solid "+(pay===m.id?C.blue:C.g200),borderRadius:12,cursor:"pointer",transition:"all .15s ease"}}>
              <input type="radio" name="p" checked={pay===m.id} onChange={()=>setPay(m.id)} style={{width:16,height:16}}/><span style={{fontWeight:700,fontSize:14,color:C.navy}}>{m.l}</span></label>))}
          <div style={{display:"flex",gap:10,marginTop:4}}><button onClick={()=>setStep(1)} style={{...btn2,flex:1,padding:"13px 0"}}>← Înapoi</button><button onClick={submit} style={{...btn,flex:2,padding:"13px 0",fontSize:15,fontWeight:900}}>Confirmă comanda</button></div>
        </div>)}
      </div>)}
    </div>
  </div>);
}

/* ═══ MAIN APP ═══ */
export default function App(){
  const[view,setView]=useState("pachete");
  const[selPkg,setSelPkg]=useState(null);
  const[dashOrder,setDashOrder]=useState(null);
  const[adCheckout,setAdCheckout]=useState(null);
  const[myOrders,setMyOrders]=useState([]);

  useEffect(()=>{sld("ods-orders",[]).then(setMyOrders)},[]);

  const onPurchased=(order)=>{setSelPkg(null);setDashOrder(order);setView("dashboard");sld("ods-orders",[]).then(setMyOrders)};

  return(
    <div style={{minHeight:"100vh",background:"#F0F4F8",fontFamily:"'Source Sans 3',-apple-system,sans-serif"}}>

      {/* TOP BAR */}
      <div className="noprint" style={{background:C.navy,padding:"13px 24px",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:22,color:C.white,fontWeight:900,cursor:"pointer",letterSpacing:-.3}} onClick={()=>{setView("pachete");setDashOrder(null)}}>Ora de Sibiu</div>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            {myOrders.length>0&&(
              <select onChange={e=>{if(e.target.value){const o=myOrders.find(x=>x.id===e.target.value);if(o){setDashOrder(o);setView("dashboard")}}}} value="" style={{padding:"7px 12px",fontSize:12,borderRadius:8,border:"1px solid rgba(255,255,255,.18)",background:"rgba(255,255,255,.09)",color:C.white,fontFamily:"'Source Sans 3',sans-serif",cursor:"pointer"}}>
                <option value="" style={{color:C.navy}}>Comenzile mele ({myOrders.length})</option>
                {myOrders.map(o=><option key={o.id} value={o.id} style={{color:C.navy}}>{o.packageName} — {new Date(o.date).toLocaleDateString("ro-RO")}</option>)}
              </select>
            )}
            <a href="https://wa.me/40746752240" target="_blank" rel="noopener" style={{fontSize:13,color:C.amber,fontWeight:700,display:"flex",alignItems:"center",gap:6,padding:"7px 14px",background:"rgba(245,158,11,.12)",borderRadius:8,border:"1px solid rgba(245,158,11,.25)",transition:"background .15s ease"}}>
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* NAV TABS */}
      {view!=="dashboard"&&(
        <div className="noprint" style={{background:C.white,borderBottom:"1px solid "+C.g200,position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(0,0,0,.06)"}}>
          <div style={{maxWidth:1100,margin:"0 auto",display:"flex"}}>
            {[{id:"pachete",label:"Pachete de Promovare",sub:"Advertoriale, bannere, social media"},{id:"anunturi",label:"Mica Publicitate",sub:"Anunturi, avize, decese, autorizatii"}].map(t=>(
              <button key={t.id} onClick={()=>setView(t.id)} className="nav-tab" style={{flex:1,padding:"18px 24px",border:"none",background:view===t.id?"#FFFBF0":C.white,cursor:"pointer",textAlign:"left",fontFamily:"'Source Sans 3',sans-serif",borderBottom:view===t.id?"3px solid "+C.amber:"3px solid transparent",transform:"none",boxShadow:"none",filter:"none",borderRadius:0}}>
                <div style={{fontSize:16,fontWeight:800,color:view===t.id?C.navy:C.g400,letterSpacing:-.1}}>{t.label}</div>
                <div style={{fontSize:12,color:view===t.id?C.g600:C.g400,marginTop:3}}>{t.sub}</div>
              </button>))}
          </div>
        </div>
      )}

      {/* HERO */}
      {view!=="dashboard"&&(
        <div className="noprint" style={{background:"linear-gradient(145deg,"+C.navy+" 0%,"+C.navy2+" 60%,#162B50 100%)",padding:"52px 24px 44px",color:C.white}}>
          <div style={{maxWidth:1100,margin:"0 auto",textAlign:"center"}}>
            {view==="pachete"?(<>
              <div style={{display:"inline-block",background:"rgba(245,158,11,.15)",border:"1px solid rgba(245,158,11,.3)",borderRadius:20,padding:"4px 16px",fontSize:12,fontWeight:700,color:C.amber,letterSpacing:1.2,textTransform:"uppercase",marginBottom:14}}>Publicitate Locala Sibiu</div>
              <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:46,margin:"0 0 14px",fontWeight:900,lineHeight:1.1,letterSpacing:-.5}}>Promoveaza-ti afacerea în Sibiu</h1>
              <p style={{color:"#94A3B8",fontSize:17,maxWidth:520,margin:"0 auto 32px",lineHeight:1.6}}>Alege pachetul. Platesti. Primesti dashboard cu statistici si control total.</p>
              <div style={{display:"flex",justifyContent:"center",gap:6,flexWrap:"wrap"}}>
                {[{v:"400k+",l:"vizitatori/luna"},{v:"1.8M",l:"afisari/luna"},{v:"218k",l:"Facebook"},{v:"18k",l:"Instagram"},{v:"24k",l:"TikTok"}].map((s,i)=>(
                  <div key={i} style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:12,padding:"12px 22px",minWidth:90}}>
                    <div style={{fontSize:26,fontWeight:800,color:C.amber,fontFamily:"'Playfair Display',Georgia,serif",lineHeight:1}}>{s.v}</div>
                    <div style={{fontSize:11,color:"#64748B",marginTop:4,letterSpacing:.5}}>{s.l}</div>
                  </div>))}
              </div>
            </>):(<>
              <div style={{display:"inline-block",background:"rgba(245,158,11,.15)",border:"1px solid rgba(245,158,11,.3)",borderRadius:20,padding:"4px 16px",fontSize:12,fontWeight:700,color:C.amber,letterSpacing:1.2,textTransform:"uppercase",marginBottom:14}}>Anunturi & Avize</div>
              <h1 style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:46,margin:"0 0 14px",fontWeight:900,lineHeight:1.1,letterSpacing:-.5}}>Mica Publicitate si Anunturi</h1>
              <p style={{color:"#94A3B8",fontSize:17,maxWidth:520,margin:"0 auto 20px",lineHeight:1.6}}>Publica anunturi pe oradesibiu.ro — avize, pierderi, decese, autorizatii</p>
              <div style={{display:"inline-flex",gap:14,background:"rgba(255,255,255,.07)",border:"1px solid rgba(255,255,255,.1)",borderRadius:14,padding:"14px 28px",alignItems:"center"}}>
                <span style={{fontSize:22,fontWeight:800,color:C.amber,fontFamily:"'Playfair Display',Georgia,serif"}}>de la 50 lei / zi</span>
                <span style={{width:1,height:28,background:"rgba(255,255,255,.15)"}}/>
                <span style={{fontSize:13,color:"#64748B",lineHeight:1.4}}>pana la 250 cuvinte<br/>doar text · verificat</span>
              </div>
            </>)}
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"32px 20px"}}>

        {view==="pachete"&&(
          <div style={{display:"flex",flexDirection:"column",gap:20}}>
            {PKG.map(p=>(
              <div key={p.id} className="pkg-card" style={{background:C.white,borderRadius:22,overflow:"hidden",boxShadow:p.pop?"0 8px 36px rgba(245,158,11,.18)":"0 2px 12px rgba(0,0,0,.06)",border:p.pop?"2px solid "+C.amber:"1.5px solid "+C.g200}}>
                {p.pop&&<div style={{background:"linear-gradient(90deg,"+C.amber+","+C.amberDeep+")",color:C.navy,fontSize:11,fontWeight:900,textAlign:"center",padding:"7px 0",letterSpacing:2,textTransform:"uppercase"}}>⭐ RECOMANDAT</div>}
                <div style={{padding:"28px 32px",display:"flex",gap:28,flexWrap:"wrap",alignItems:"flex-start"}}>
                  <div style={{flex:"1 1 360px"}}>
                    <div style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:14}}>
                      <div style={{width:6,height:48,background:p.color,borderRadius:4,flexShrink:0,marginTop:2}}/>
                      <div>
                        <h3 style={{margin:"0 0 4px",fontFamily:"'Playfair Display',Georgia,serif",fontSize:24,color:C.navy,fontWeight:900,lineHeight:1.2}}>{p.name}</h3>
                        <div style={{fontSize:14,color:C.g600,lineHeight:1.4}}>{p.headline}</div>
                      </div>
                    </div>
                    <div style={{fontSize:11,fontWeight:700,color:C.g400,textTransform:"uppercase",letterSpacing:1.2,marginBottom:10}}>Ce primesti:</div>
                    {p.inc.map((x,i)=>(
                      <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid "+C.g100}}>
                        <span style={{color:p.color,fontWeight:900,flexShrink:0,fontSize:15}}>✓</span>
                        <div><span style={{fontSize:14,fontWeight:700,color:C.navy}}>{x.w}</span>{x.d&&<span style={{fontSize:13,color:C.g400}}> — {x.d}</span>}</div>
                      </div>))}
                    <div style={{marginTop:12,padding:"8px 12px",background:C.g50,borderRadius:8,fontSize:13,color:C.g600,border:"1px solid "+C.g100}}>📅 {p.delivery}</div>
                  </div>
                  <div style={{flex:"0 0 210px",background:"linear-gradient(160deg,"+C.g50+","+C.white+")",borderRadius:16,padding:"22px 20px",textAlign:"center",border:"1.5px solid "+C.g100,boxShadow:"inset 0 1px 3px rgba(0,0,0,.04)"}}>
                    <div style={{fontSize:42,fontWeight:900,color:C.navy,fontFamily:"'Playfair Display',Georgia,serif",lineHeight:1}}>{p.price.toLocaleString("ro")}</div>
                    <div style={{fontSize:14,color:C.g400,marginTop:4}}>lei + TVA{p.cat!=="oneTime"?" /lună":""}</div>
                    {p.sub&&<div style={{fontSize:13,color:C.green,fontWeight:700,marginTop:10,background:C.greenBg,borderRadius:8,padding:"5px 10px",display:"inline-block",border:"1px solid #A7F3D0"}}>{p.sub.toLocaleString("ro")} lei la abonament</div>}
                    <button onClick={()=>setSelPkg(p)} style={{...btn,width:"100%",padding:"15px 0",fontSize:16,marginTop:16,borderRadius:12,background:p.pop?C.amber:C.navy,color:p.pop?C.navy:C.white,fontWeight:900}}>Cumpara acum</button>
                    <div style={{fontSize:11,color:C.g400,marginTop:8}}>Completezi detaliile după plată</div>
                  </div>
                </div>
              </div>))}
          </div>
        )}

        {view==="anunturi"&&<AnunturiView onBuyAd={setAdCheckout}/>}

        {view==="dashboard"&&dashOrder&&<Dashboard initOrder={dashOrder} onBack={()=>{setView("pachete");setDashOrder(null)}}/>}

        {/* Footer */}
        <div style={{marginTop:40,background:C.white,borderRadius:20,padding:"28px 24px",textAlign:"center",border:"1.5px solid "+C.g100,boxShadow:"0 2px 12px rgba(0,0,0,.05)"}}>
          <div style={{display:"flex",justifyContent:"center",gap:6,flexWrap:"wrap",marginBottom:16}}>
            {["17 ani experiență","Trafic auditat BRAT","Dashboard cu statistici","400k+ vizitatori/lună"].map((t,i)=>(
              <span key={i} style={{fontSize:12,color:C.g600,fontWeight:700,background:C.g50,padding:"5px 14px",borderRadius:20,border:"1px solid "+C.g200}}>{t}</span>
            ))}
          </div>
          <a href="https://www.brat.ro/sati/site/oradesibiu-ro/trafic-total/trafic-total" target="_blank" rel="noopener" style={{display:"inline-block",padding:"10px 24px",background:C.navy,color:C.white,borderRadius:10,fontWeight:700,fontSize:13,letterSpacing:.2}}>Verifică audit BRAT →</a>
          <div style={{marginTop:14,fontSize:12,color:C.g400,lineHeight:1.8}}>{ODS.company} &nbsp;·&nbsp; CIF {ODS.cif} &nbsp;·&nbsp; {ODS.reg} &nbsp;·&nbsp; {ODS.phone}</div>
        </div>
      </div>

      {selPkg&&<QuickBuy pkg={selPkg} onClose={()=>setSelPkg(null)} onDone={onPurchased}/>}
      {adCheckout&&<AdCheckout ad={adCheckout} onClose={()=>setAdCheckout(null)}/>}
    </div>
  );
}
