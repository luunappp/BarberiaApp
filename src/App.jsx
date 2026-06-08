import { useState, useEffect } from "react";

// ══════════════════════════════════════════════════════════════
// SUPABASE CONFIG
// ══════════════════════════════════════════════════════════════
const SUPABASE_URL = "https://cafdkslzwvgrebqwssut.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhZmRrc2x6d3ZncmVicXdzc3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4ODA5MjAsImV4cCI6MjA5NjQ1NjkyMH0.mFNG6qPcFHg0mwJS0Ctx55CMgdknGKoNIR6nak5zGQU";

const sb = {
  headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` },
  async getAll() {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/reservas?select=*`, { headers: this.headers });
    return r.json();
  },
  async insert(data) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/reservas`, {
      method: "POST", headers: { ...this.headers, "Prefer": "return=representation" },
      body: JSON.stringify(data)
    });
    return r.json();
  },
  async delete(id) {
    await fetch(`${SUPABASE_URL}/rest/v1/reservas?id=eq.${id}`, { method: "DELETE", headers: this.headers });
  }
};

// ══════════════════════════════════════════════════════════════
// CREDENCIALES
// ══════════════════════════════════════════════════════════════
const ADMIN_USER = "Mario Sánchez";
const ADMIN_PASS = "Mario.CTH2026";

function generarCodigo() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "HZ-";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// ══════════════════════════════════════════════════════════════
// HORARIOS — turnos de 30 min, viernes hasta 1:30 PM
// ══════════════════════════════════════════════════════════════
const TARDE = ["11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30"];
const TARDE_VIE = ["11:30","12:00","12:30","13:00","13:30"];

const HORARIOS_POR_DIA = {
  0: [],
  1: ["09:00","10:50"],
  2: ["09:00","10:50","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30"],
  3: ["09:00","10:50","14:00","14:30","15:00","15:30"],
  4: ["09:00","10:50","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30"],
  5: ["09:00","10:50",...TARDE_VIE],
  6: [],
};

const HORARIOS_LABEL = {
  "09:00":"9:00 AM","10:50":"10:50 AM",
  "11:30":"11:30 AM",
  "12:00":"12:00 PM","12:30":"12:30 PM",
  "13:00":"1:00 PM","13:30":"1:30 PM",
  "14:00":"2:00 PM","14:30":"2:30 PM",
  "15:00":"3:00 PM","15:30":"3:30 PM",
};

const SERVICIOS = [
  { id:"corte",      label:"Corte de pelo",         precio:2.50, icon:"✂️" },
  { id:"cejas",      label:"Limpieza de cejas",      precio:1.00, icon:"🪮" },
  { id:"barba",      label:"Bigote / Barba",         precio:1.00, icon:"🪒" },
  { id:"cortecejas", label:"Corte + Cejas",          precio:3.50, icon:"✨" },
  { id:"combo",      label:"Corte + Barba",          precio:3.50, icon:"⭐" },
  { id:"full",       label:"Corte + Cejas + Barba",  precio:4.50, icon:"💈" },
];

const SECCIONES = ["9°","1°A","1°C","1°BD","1°E","2°A","2°C","2°BD","3°B","3°C"];
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS_CORTO = ["D","L","M","X","J","V","S"];
const DIAS_NOMBRE = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

const C = {
  bg:"#0a0f0a",card:"#111811",cardB:"#1e2a1e",
  gold:"#f5c518",goldL:"#ffe566",goldD:"#a88200",
  green:"#2ecc71",greenD:"#1a7a42",
  text:"#f0f5f0",textM:"#8aab8a",textD:"#4a6a4a",
  red:"#e74c3c",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
  body{background:#0a0f0a;font-family:'DM Sans',sans-serif;color:#f0f5f0;}
  input,textarea,button{font-family:'DM Sans',sans-serif;}
  button{cursor:pointer;}
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-thumb{background:#1a7a42;border-radius:4px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes popIn{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}
  @keyframes notifIn{0%{transform:translateX(-50%) translateY(-60px);opacity:0}12%{transform:translateX(-50%) translateY(0);opacity:1}80%{opacity:1}100%{opacity:0;transform:translateX(-50%) translateY(-60px)}}
  @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
  @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(245,197,24,.4)}70%{box-shadow:0 0 0 8px rgba(245,197,24,0)}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
`;

function hoyStr(){const h=new Date();return `${h.getFullYear()}-${String(h.getMonth()+1).padStart(2,"0")}-${String(h.getDate()).padStart(2,"0")}`;}
function fechaKey(y,m,d){return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;}
function getDiaSemana(fechaStr){const[y,m,d]=fechaStr.split("-").map(Number);return new Date(y,m-1,d).getDay();}
function formatPrecio(p){return p%1===0?`$${p}.00`:`$${p.toFixed(2)}`;}

const st={
  shell:{maxWidth:420,margin:"0 auto",minHeight:"100dvh",background:C.bg,display:"flex",flexDirection:"column",boxShadow:"0 0 80px rgba(46,204,113,.07)"},
  statusBar:{display:"flex",justifyContent:"space-between",padding:"8px 20px 4px",color:C.textD,fontSize:11},
  header:{display:"flex",alignItems:"center",gap:12,padding:"12px 20px",borderBottom:`1px solid ${C.cardB}`,background:"linear-gradient(180deg,#0d160d,#0a0f0a)"},
  tabs:{display:"flex",borderBottom:`1px solid ${C.cardB}`,background:"#0d110d"},
  tabBtn:{flex:1,padding:"12px 0",border:"none",background:"transparent",color:C.textM,fontSize:12,fontWeight:500,borderBottom:"2px solid transparent",transition:"all .2s"},
  tabActivo:{color:C.gold,borderBottom:`2px solid ${C.gold}`,background:"rgba(245,197,24,.05)"},
  body:{flex:1,overflowY:"auto",padding:"18px 16px 28px",display:"flex",flexDirection:"column"},
  navBtn:{background:C.card,border:`1px solid #2e3e2e`,color:C.gold,width:38,height:38,borderRadius:10,fontSize:22,display:"flex",alignItems:"center",justifyContent:"center"},
  grid7:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:4},
  diaBtn:{background:C.card,border:`1px solid #1e2e1e`,borderRadius:10,padding:"8px 2px",textAlign:"center",fontSize:14,color:C.text,position:"relative",display:"flex",flexDirection:"column",alignItems:"center",gap:2,transition:"all .15s"},
  diaBtnHoy:{background:"rgba(46,204,113,.1)",border:`1.5px solid ${C.greenD}`,color:C.green,fontWeight:700},
  dotCita:{position:"absolute",bottom:4,left:"50%",transform:"translateX(-50%)",width:5,height:5,borderRadius:"50%",background:C.gold},
  back:{background:"none",border:"none",color:C.gold,fontSize:14,marginBottom:14,padding:0},
  subTitulo:{fontSize:13,color:C.textM,marginBottom:14},
  horaBtn:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",borderRadius:12,border:"1px solid",background:C.card,width:"100%",transition:"all .15s"},
  horaBtnLibre:{borderColor:"#2e3e2e",color:C.text},
  horaBtnOcup:{borderColor:"#2a1a1a",background:"#1a1212",color:C.textD,cursor:"not-allowed",opacity:.7},
  pillResumen:{background:"rgba(245,197,24,.08)",border:`1px solid ${C.goldD}`,borderRadius:20,padding:"8px 14px",fontSize:13,color:C.goldL,textAlign:"center",marginBottom:18},
  labelField:{fontSize:12,color:C.textM,marginBottom:8,textTransform:"uppercase",letterSpacing:"1.5px"},
  srvBtn:{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"14px 8px",borderRadius:12,border:`1px solid #2a3a2a`,background:C.card,color:C.text,transition:"all .15s"},
  srvBtnActivo:{border:`1.5px solid ${C.gold}`,background:"rgba(245,197,24,.1)"},
  input:{width:"100%",background:C.card,border:`1px solid #2e3e2e`,borderRadius:10,padding:"12px 14px",color:C.text,fontSize:14,marginBottom:18,outline:"none"},
  secBtn:{padding:"8px 12px",borderRadius:10,border:`1px solid #2a3a2a`,background:C.card,color:C.textM,fontWeight:600,fontSize:13,transition:"all .15s"},
  secBtnActivo:{background:"rgba(46,204,113,.15)",border:`1.5px solid ${C.green}`,color:C.green},
  btnPrimary:{width:"100%",padding:"15px",borderRadius:12,background:C.gold,border:"none",color:"#0a0f0a",fontSize:15,fontWeight:700,letterSpacing:".5px",transition:"opacity .2s"},
  btnSecundario:{marginTop:12,width:"100%",padding:"13px",borderRadius:12,border:`1px solid ${C.goldD}`,background:"transparent",color:C.gold,fontSize:14,fontWeight:500},
  checkCircle:{width:72,height:72,borderRadius:"50%",background:"rgba(46,204,113,.15)",border:`2px solid ${C.green}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,color:C.green,margin:"0 auto"},
  resumenCard:{background:C.card,border:`1px solid ${C.cardB}`,borderRadius:14,padding:"14px 16px",textAlign:"left",marginBottom:8},
  notifBanner:{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",background:"#0d1f0d",border:`1px solid ${C.green}`,borderRadius:24,padding:"10px 20px",color:C.green,fontSize:13,fontWeight:500,zIndex:999,whiteSpace:"nowrap",animation:"notifIn 3.5s ease forwards"},
  spinner:{width:36,height:36,border:`3px solid ${C.cardB}`,borderTop:`3px solid ${C.gold}`,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"40px auto"},
};

// ══════════════════════════════════════════════════════════════
// SUBCOMPONENTES
// ══════════════════════════════════════════════════════════════

function Calendario({reservas,mesV,setMesV,anioV,setAnioV,setDiaSelec,setVista}){
  const hoy=new Date();
  const primerDia=new Date(anioV,mesV,1).getDay();
  const totalDias=new Date(anioV,mesV+1,0).getDate();
  const hoyS=hoyStr();
  const puedeAtras=!(anioV===hoy.getFullYear()&&mesV===hoy.getMonth());
  const celdas=[...Array(primerDia).fill(null),...Array.from({length:totalDias},(_,i)=>i+1)];
  return(
    <div style={{animation:"fadeUp .35s ease"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <button style={st.navBtn} disabled={!puedeAtras} onClick={()=>{mesV===0?(setMesV(11),setAnioV(a=>a-1)):setMesV(m=>m-1);}}>‹</button>
        <span style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700}}>{MESES[mesV]} {anioV}</span>
        <button style={st.navBtn} onClick={()=>{mesV===11?(setMesV(0),setAnioV(a=>a+1)):setMesV(m=>m+1);}}>›</button>
      </div>
      <div style={st.grid7}>{DIAS_CORTO.map(d=><div key={d} style={{textAlign:"center",fontSize:11,color:C.textD,fontWeight:600,padding:"4px 0"}}>{d}</div>)}</div>
      <div style={st.grid7}>
        {celdas.map((dia,i)=>{
          if(!dia)return <div key={`e${i}`}/>;
          const fecha=fechaKey(anioV,mesV,dia);
          const esHoy=fecha===hoyS;
          const pasado=fecha<hoyS;
          const diaSem=getDiaSemana(fecha);
          const cerrado=(HORARIOS_POR_DIA[diaSem]||[]).length===0;
          const nCitas=reservas.filter(r=>r.fecha===fecha).length;
          return(
            <button key={dia} disabled={pasado||cerrado}
              onClick={()=>{setDiaSelec({dia,fecha,label:`${dia} de ${MESES[mesV]}`,diaSem});setVista("horas");}}
              style={{...st.diaBtn,...(esHoy?st.diaBtnHoy:{}),  ...((pasado||cerrado)?{opacity:.25,cursor:"not-allowed"}:{})}}>
              <span>{dia}</span>
              {cerrado&&!pasado&&<span style={{fontSize:7,color:C.textD}}>cerrado</span>}
              {nCitas>0&&!pasado&&!cerrado&&<span style={st.dotCita}/>}
            </button>
          );
        })}
      </div>
      <div style={{marginTop:14,fontSize:11,color:C.textD}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span style={{width:6,height:6,borderRadius:"50%",background:C.gold,display:"inline-block"}}/>Días con citas</div>
        <div>📅 Lun · Mar · Mié · Jue · Vie &nbsp;·&nbsp; Sáb y Dom cerrado</div>
      </div>
    </div>
  );
}

function Horarios({reservas,diaSelec,setHoraSelec,setVista}){
  const horariosDelDia=HORARIOS_POR_DIA[diaSelec?.diaSem]||[];
  const citasDia=reservas.filter(r=>r.fecha===diaSelec?.fecha);
  return(
    <div style={{animation:"fadeUp .3s ease"}}>
      <button style={st.back} onClick={()=>setVista("cal")}>← {diaSelec?.label}</button>
      <p style={st.subTitulo}>{DIAS_NOMBRE[diaSelec?.diaSem]} · Elige una hora</p>
      <div style={{fontSize:11,color:C.textD,marginBottom:12,background:C.cardB,borderRadius:8,padding:"6px 10px"}}>
        ⏱ 30 min por turno &nbsp;·&nbsp; {diaSelec?.diaSem===5?"Cierre: 1:30 PM":"Cierre: 3:30 PM"}
      </div>
      {horariosDelDia.length===0
        ?<div style={{textAlign:"center",color:C.textD,padding:30}}>Este día no hay atención 🚫</div>
        :<div style={{display:"flex",flexDirection:"column",gap:10}}>
          {horariosDelDia.map(h=>{
            const cita=citasDia.find(r=>r.hora===h);
            const ocup=!!cita;
            return(
              <button key={h} disabled={ocup}
                onClick={()=>{setHoraSelec(h);setVista("form");}}
                style={{...st.horaBtn,...(ocup?st.horaBtnOcup:st.horaBtnLibre)}}>
                <span style={{fontSize:16,fontWeight:600}}>{HORARIOS_LABEL[h]}</span>
                {ocup
                  ?<span style={{fontSize:12,color:C.textD}}>✕ Ocupado — {cita?.nombre}</span>
                  :<span style={{fontSize:12,color:C.green}}>✓ Disponible</span>
                }
              </button>
            );
          })}
        </div>
      }
    </div>
  );
}

function Formulario({diaSelec,horaSelec,setVista,onConfirmar,guardando}){
  const [srvSelec,setSrvSelec]=useState(null);
  const [nombre,  setNombre]  =useState("");
  const [seccion, setSeccion] =useState("");
  const listo=nombre.trim()&&seccion&&srvSelec&&!guardando;
  return(
    <div style={{animation:"fadeUp .3s ease"}}>
      <button style={st.back} onClick={()=>setVista("horas")}>← {HORARIOS_LABEL[horaSelec]}</button>
      <p style={st.subTitulo}>Completa tu reserva</p>
      <div style={st.pillResumen}>📅 {diaSelec?.label} &nbsp;·&nbsp; 🕐 {HORARIOS_LABEL[horaSelec]}</div>
      <p style={st.labelField}>Servicio</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18}}>
        {SERVICIOS.map(s=>(
          <button key={s.id} onClick={()=>setSrvSelec(s.id)} style={{...st.srvBtn,...(srvSelec===s.id?st.srvBtnActivo:{})}}>
            <span style={{fontSize:24}}>{s.icon}</span>
            <span style={{fontSize:12,fontWeight:500,textAlign:"center"}}>{s.label}</span>
            <span style={{fontSize:16,fontWeight:700,color:C.gold}}>{formatPrecio(s.precio)}</span>
          </button>
        ))}
      </div>
      <p style={st.labelField}>Tu nombre</p>
      <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Escribe tu nombre completo" style={st.input}/>
      <p style={st.labelField}>Sección</p>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:24}}>
        {SECCIONES.map(s=>(
          <button key={s} onClick={()=>setSeccion(s)} style={{...st.secBtn,...(seccion===s?st.secBtnActivo:{})}}>{s}</button>
        ))}
      </div>
      <button onClick={()=>onConfirmar(nombre.trim(),seccion,SERVICIOS.find(s=>s.id===srvSelec))}
        disabled={!listo} style={{...st.btnPrimary,...(!listo?{opacity:.4,cursor:"not-allowed"}:{})}}>
        {guardando?"Guardando...":"Confirmar cita"}
      </button>
    </div>
  );
}

function Confirmacion({ultima,onNueva}){
  return(
    <div style={{animation:"popIn .4s cubic-bezier(.175,.885,.32,1.275)",textAlign:"center",padding:"10px 0"}}>
      <div style={st.checkCircle}>✓</div>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:26,color:C.gold,margin:"16px 0 6px"}}>¡Cita confirmada!</h2>
      <p style={{color:C.textM,fontSize:14,marginBottom:16}}>Te esperamos puntual 💈 Mario Sánchez</p>
      <div style={{background:"rgba(245,197,24,.08)",border:`2px dashed ${C.gold}`,borderRadius:16,padding:"16px",marginBottom:20,animation:"pulse 2s infinite"}}>
        <p style={{fontSize:11,color:C.textM,letterSpacing:"2px",textTransform:"uppercase",marginBottom:6}}>Tu código de cita</p>
        <p style={{fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:900,color:C.gold,letterSpacing:4}}>{ultima?.codigo}</p>
        <p style={{fontSize:11,color:C.red,marginTop:8,fontWeight:500}}>⚠️ Guardá este código — lo necesitarás para cancelar</p>
      </div>
      <div style={st.resumenCard}>
        {[
          {icon:"👤",label:"Nombre",val:ultima?.nombre},
          {icon:"🏷️",label:"Sección",val:`Sección ${ultima?.seccion}`},
          {icon:"📅",label:"Fecha",val:ultima?.fecha_label},
          {icon:"🕐",label:"Hora",val:HORARIOS_LABEL[ultima?.hora]},
          {icon:ultima?.servicio_icon,label:"Servicio",val:ultima?.servicio_label},
        ].map(({icon,label,val})=>(
          <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.cardB}`}}>
            <span style={{color:C.textM,fontSize:13}}>{icon} {label}</span>
            <span style={{fontWeight:500,fontSize:13}}>{val}</span>
          </div>
        ))}
        <div style={{display:"flex",justifyContent:"space-between",paddingTop:12,marginTop:4}}>
          <span style={{color:C.textM}}>Total</span>
          <span style={{color:C.gold,fontWeight:700,fontSize:20}}>{formatPrecio(ultima?.servicio_precio||0)}</span>
        </div>
      </div>
      <button onClick={onNueva} style={st.btnSecundario}>Reservar otra cita</button>
    </div>
  );
}

function Cancelacion({reservas,onCancelar}){
  const [codigo,    setCodigo]    =useState("");
  const [error,     setError]     =useState("");
  const [shake,     setShake]     =useState(false);
  const [encontrada,setEncontrada]=useState(null);
  const [cancelando,setCancelando]=useState(false);

  const buscar=()=>{
    const c=codigo.trim().toUpperCase();
    if(!c){setError("Ingresa tu código de cita.");return;}
    const res=reservas.find(r=>r.codigo===c);
    if(!res){setError("Código incorrecto. Revisá bien el código que recibiste.");setShake(true);setTimeout(()=>setShake(false),500);setEncontrada(null);}
    else{setError("");setEncontrada(res);}
  };
  const confirmar=async()=>{
    setCancelando(true);
    await onCancelar(encontrada);
    setEncontrada(null);setCodigo("");setCancelando(false);
  };

  return(
    <div style={{animation:"fadeUp .3s ease"}}>
      <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:C.gold,marginBottom:6}}>Cancelar cita</h3>
      <p style={{...st.subTitulo,marginBottom:20}}>Ingresa el código único que recibiste al reservar</p>
      {!encontrada?(
        <>
          <div style={{animation:shake?"shake .4s ease":undefined}}>
            <p style={st.labelField}>Código de cita</p>
            <input value={codigo} onChange={e=>{setCodigo(e.target.value.toUpperCase());setError("");}}
              onKeyDown={e=>e.key==="Enter"&&buscar()} placeholder="Ej: HZ-A3K9"
              style={{...st.input,textAlign:"center",fontSize:22,fontWeight:700,letterSpacing:4,...(error?{borderColor:C.red}:{})}}/>
            {error&&<p style={{color:C.red,fontSize:12,marginTop:-12,marginBottom:16,textAlign:"center"}}>{error}</p>}
          </div>
          <button onClick={buscar} style={st.btnPrimary}>Buscar cita</button>
        </>
      ):(
        <div style={{animation:"fadeUp .3s ease"}}>
          <p style={{color:C.green,fontSize:13,marginBottom:16,textAlign:"center"}}>✓ Cita encontrada</p>
          <div style={st.resumenCard}>
            {[
              {icon:"👤",label:"Nombre",val:encontrada.nombre},
              {icon:"🏷️",label:"Sección",val:`Sección ${encontrada.seccion}`},
              {icon:"📅",label:"Fecha",val:encontrada.fecha_label},
              {icon:"🕐",label:"Hora",val:HORARIOS_LABEL[encontrada.hora]},
              {icon:encontrada.servicio_icon,label:"Servicio",val:encontrada.servicio_label},
            ].map(({icon,label,val})=>(
              <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.cardB}`}}>
                <span style={{color:C.textM,fontSize:13}}>{icon} {label}</span>
                <span style={{fontWeight:500,fontSize:13}}>{val}</span>
              </div>
            ))}
          </div>
          <button onClick={confirmar} disabled={cancelando}
            style={{width:"100%",padding:"14px",borderRadius:12,background:"rgba(231,76,60,.15)",border:`1px solid ${C.red}`,color:C.red,fontWeight:700,fontSize:15,marginTop:8}}>
            {cancelando?"Cancelando...":"🗑️ Sí, cancelar esta cita"}
          </button>
          <button onClick={()=>{setEncontrada(null);setCodigo("");}} style={st.btnSecundario}>← Volver</button>
        </div>
      )}
    </div>
  );
}

function LoginAdmin({onLogin}){
  const [user,setUser]=useState("");
  const [pass,setPass]=useState("");
  const [error,setError]=useState(false);
  const [shake,setShake]=useState(false);
  const intentar=()=>{
    if(user.trim()===ADMIN_USER&&pass===ADMIN_PASS){onLogin();}
    else{setError(true);setShake(true);setTimeout(()=>setShake(false),500);}
  };
  return(
    <div style={{animation:"fadeUp .35s ease",display:"flex",flexDirection:"column",alignItems:"center",padding:"30px 0"}}>
      <div style={{width:72,height:72,borderRadius:"50%",overflow:"hidden",border:`2px solid ${C.gold}`,marginBottom:20}}>
        <img src="/logo.jpeg" alt="logo" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display="none";}}/>
      </div>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:C.gold,marginBottom:4}}>Área del Barbero</h2>
      <p style={{color:C.textD,fontSize:13,marginBottom:28}}>Acceso exclusivo para Mario Sánchez</p>
      <div style={{width:"100%",animation:shake?"shake .4s ease":undefined}}>
        <p style={st.labelField}>Usuario</p>
        <input value={user} onChange={e=>{setUser(e.target.value);setError(false);}} onKeyDown={e=>e.key==="Enter"&&intentar()}
          placeholder="Mario Sánchez" style={{...st.input,...(error?{borderColor:C.red}:{})}}/>
        <p style={st.labelField}>Contraseña</p>
        <input type="password" value={pass} onChange={e=>{setPass(e.target.value);setError(false);}} onKeyDown={e=>e.key==="Enter"&&intentar()}
          placeholder="••••••••••" style={{...st.input,...(error?{borderColor:C.red}:{})}}/>
        {error&&<p style={{color:C.red,fontSize:12,marginTop:-12,marginBottom:16,textAlign:"center"}}>⚠️ Usuario o contraseña incorrectos</p>}
        <button onClick={intentar} style={st.btnPrimary}>Ingresar</button>
      </div>
    </div>
  );
}

function PanelAdmin({reservas,onLogout,onEliminar}){
  const [panelTab,  setPanelTab]  =useState("citas");
  const [busq,      setBusq]      =useState("");
  const citasHoy=reservas.filter(r=>r.fecha===hoyStr()).length;

  const grupos=Object.entries(
    reservas.reduce((acc,r)=>{
      if(!acc[r.fecha])acc[r.fecha]=[];
      acc[r.fecha].push(r);
      return acc;
    },{})
  ).sort(([a],[b])=>a.localeCompare(b));

  const filtradas=busq.trim()?reservas.filter(r=>r.nombre.toLowerCase().includes(busq.toLowerCase())):null;

  return(
    <div style={{animation:"fadeUp .3s ease"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 4px 10px",borderBottom:`1px solid ${C.cardB}`,marginBottom:12}}>
        <div style={{width:42,height:42,borderRadius:"50%",overflow:"hidden",border:`1.5px solid ${C.greenD}`,flexShrink:0}}>
          <img src="/logo.jpeg" alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display="none";}}/>
        </div>
        <div style={{flex:1}}>
          <div style={{fontWeight:600,fontSize:15}}>Mario Sánchez</div>
          <div style={{color:C.green,fontSize:11}}>● Administrador</div>
        </div>
        <div style={{background:"rgba(245,197,24,.15)",border:`1px solid ${C.goldD}`,borderRadius:20,padding:"4px 10px",fontSize:12,color:C.goldL,fontWeight:600}}>{citasHoy} hoy</div>
        <button onClick={onLogout} style={{background:"rgba(231,76,60,.15)",border:`1px solid ${C.red}`,borderRadius:8,padding:"4px 10px",color:C.red,fontSize:12}}>Salir</button>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:16}}>
        <input value={busq} onChange={e=>setBusq(e.target.value)} placeholder="Buscar por nombre..."
          style={{...st.input,marginBottom:0,flex:1,fontSize:13,padding:"10px 12px"}}/>
        {busq&&<button onClick={()=>setBusq("")} style={{background:C.cardB,border:`1px solid #2e3e2e`,borderRadius:10,padding:"0 12px",color:C.textM,fontSize:13}}>✕</button>}
      </div>

      {busq.trim()
        ?(filtradas?.length===0
            ?<p style={{color:C.textD,textAlign:"center",padding:20}}>No se encontró ninguna cita.</p>
            :filtradas?.map(r=><TarjetaAdmin key={r.id} r={r} onEliminar={()=>onEliminar(r)}/>)
          )
        :(grupos.length===0
            ?<p style={{color:C.textD,textAlign:"center",padding:30}}>No hay citas agendadas.</p>
            :grupos.map(([fecha,citas])=>(
              <div key={fecha} style={{marginBottom:20}}>
                <div style={{fontSize:11,color:C.gold,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",marginBottom:8,padding:"4px 0",borderBottom:`1px solid ${C.cardB}`}}>
                  📅 {citas[0]?.fecha_label||fecha}
                  <span style={{marginLeft:8,background:"rgba(245,197,24,.15)",borderRadius:10,padding:"1px 8px",fontSize:10}}>{citas.length} cita{citas.length!==1?"s":""}</span>
                </div>
                {[...citas].sort((a,b)=>a.hora.localeCompare(b.hora)).map(r=>(
                  <TarjetaAdmin key={r.id} r={r} onEliminar={()=>onEliminar(r)}/>
                ))}
              </div>
            ))
          )
      }
    </div>
  );
}

function TarjetaAdmin({r,onEliminar}){
  return(
    <div style={{...st.resumenCard,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:600,fontSize:14,marginBottom:2}}>{r.nombre}</div>
        <div style={{fontSize:12,color:C.textM}}>{r.servicio_icon} {r.servicio_label} · Sección {r.seccion}</div>
        <div style={{fontSize:12,color:C.textD,marginTop:2}}>🕐 {HORARIOS_LABEL[r.hora]} · 🔑 {r.codigo}</div>
      </div>
      <button onClick={onEliminar}
        style={{background:"rgba(231,76,60,.15)",border:`1px solid ${C.red}`,borderRadius:10,padding:"10px 12px",color:C.red,fontSize:18,flexShrink:0}}>
        🗑️
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// APP PRINCIPAL
// ══════════════════════════════════════════════════════════════
export default function App(){
  const hoy=new Date();
  const [tab,          setTab]          =useState("cliente");
  const [vista,        setVista]        =useState("cal");
  const [mesV,         setMesV]         =useState(hoy.getMonth());
  const [anioV,        setAnioV]        =useState(hoy.getFullYear());
  const [diaSelec,     setDiaSelec]     =useState(null);
  const [horaSelec,    setHoraSelec]    =useState(null);
  const [reservas,     setReservas]     =useState([]);
  const [ultima,       setUltima]       =useState(null);
  const [notif,        setNotif]        =useState(null);
  const [adminLogueado,setAdminLogueado]=useState(false);
  const [cargando,     setCargando]     =useState(true);
  const [guardando,    setGuardando]    =useState(false);

  const cargarReservas=async()=>{
    try{
      const data=await sb.getAll();
      const hoyS=hoyStr();
      // Borrar pasadas
      const pasadas=(data||[]).filter(r=>r.fecha<hoyS);
      for(const r of pasadas) await sb.delete(r.id);
      setReservas((data||[]).filter(r=>r.fecha>=hoyS));
    }catch(e){console.error(e);}
    setCargando(false);
  };

  useEffect(()=>{cargarReservas();},[]);

  const mostrarNotif=(txt)=>{setNotif(txt);setTimeout(()=>setNotif(null),3500);};

  const handleConfirmar=async(nombre,seccion,srv)=>{
    setGuardando(true);
    const codigo=generarCodigo();
    const nueva={
      nombre, seccion, fecha:diaSelec.fecha, hora:horaSelec,
      servicio_id:srv.id, servicio_label:srv.label,
      servicio_precio:srv.precio, servicio_icon:srv.icon,
      fecha_label:diaSelec.label, codigo
    };
    await sb.insert(nueva);
    await cargarReservas();
    setUltima(nueva);
    mostrarNotif(`✅ ¡Cita confirmada para ${nombre}!`);
    setGuardando(false);
    setVista("ok");
  };

  const handleCancelar=async(r)=>{
    await sb.delete(r.id);
    await cargarReservas();
    mostrarNotif(`🗑️ Cita de ${r.nombre} cancelada`);
  };

  const handleEliminar=async(r)=>{
    await sb.delete(r.id);
    await cargarReservas();
    mostrarNotif(`🗑️ Cita de ${r.nombre} eliminada`);
  };

  return(
    <>
      <style>{GLOBAL_CSS}</style>
      {notif&&<div style={st.notifBanner}>{notif}</div>}
      <div style={st.shell}>
        <div style={st.statusBar}>
          <span>{new Date().toLocaleTimeString("es-SV",{hour:"2-digit",minute:"2-digit"})}</span>
          <span style={{fontFamily:"'Playfair Display',serif",letterSpacing:1}}>✦ Barber Herzl</span>
          <span>🔋</span>
        </div>
        <div style={st.header}>
          <img src="/logo.jpeg" alt="Barber Herzl" style={{width:54,height:54,borderRadius:"50%",objectFit:"cover",border:`2px solid ${C.gold}`,flexShrink:0}} onError={e=>{e.target.style.display="none";}}/>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:900,color:C.gold}}>Barber Herzl</div>
            <div style={{fontSize:10,color:C.textD,letterSpacing:"2.5px",textTransform:"uppercase"}}>Mario Sánchez · Reservas</div>
          </div>
        </div>
        <div style={st.tabs}>
          {[{key:"cliente",label:"📅 Reservar"},{key:"cancelar",label:"🗑️ Cancelar"},{key:"barbero",label:"💈 Barbero"}].map(t=>(
            <button key={t.key} onClick={()=>{setTab(t.key);if(t.key==="cliente")setVista("cal");}}
              style={{...st.tabBtn,...(tab===t.key?st.tabActivo:{})}}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={st.body}>
          {cargando ? <div style={st.spinner}/> : (
            <>
              {tab==="cliente"&&(
                <>
                  {vista==="cal"   &&<Calendario reservas={reservas} mesV={mesV} setMesV={setMesV} anioV={anioV} setAnioV={setAnioV} setDiaSelec={setDiaSelec} setVista={setVista}/>}
                  {vista==="horas" &&<Horarios reservas={reservas} diaSelec={diaSelec} setHoraSelec={setHoraSelec} setVista={setVista}/>}
                  {vista==="form"  &&<Formulario diaSelec={diaSelec} horaSelec={horaSelec} setVista={setVista} onConfirmar={handleConfirmar} guardando={guardando}/>}
                  {vista==="ok"    &&<Confirmacion ultima={ultima} onNueva={()=>{setVista("cal");setDiaSelec(null);setHoraSelec(null);}}/>}
                </>
              )}
              {tab==="cancelar"&&<Cancelacion reservas={reservas} onCancelar={handleCancelar}/>}
              {tab==="barbero"&&(adminLogueado
                ?<PanelAdmin reservas={reservas} onLogout={()=>setAdminLogueado(false)} onEliminar={handleEliminar}/>
                :<LoginAdmin onLogin={()=>setAdminLogueado(true)}/>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}cat > /mnt/user-data/outputs/App.jsx << 'ENDOFFILE'
import { useState, useEffect } from "react";

// ══════════════════════════════════════════════════════════════
// SUPABASE CONFIG
// ══════════════════════════════════════════════════════════════
const SUPABASE_URL = "https://cafdkslzwvgrebqwssut.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhZmRrc2x6d3ZncmVicXdzc3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4ODA5MjAsImV4cCI6MjA5NjQ1NjkyMH0.mFNG6qPcFHg0mwJS0Ctx55CMgdknGKoNIR6nak5zGQU";

const sb = {
  headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` },
  async getAll() {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/reservas?select=*`, { headers: this.headers });
    return r.json();
  },
  async insert(data) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/reservas`, {
      method: "POST", headers: { ...this.headers, "Prefer": "return=representation" },
      body: JSON.stringify(data)
    });
    return r.json();
  },
  async delete(id) {
    await fetch(`${SUPABASE_URL}/rest/v1/reservas?id=eq.${id}`, { method: "DELETE", headers: this.headers });
  }
};

// ══════════════════════════════════════════════════════════════
// CREDENCIALES
// ══════════════════════════════════════════════════════════════
const ADMIN_USER = "Mario Sánchez";
const ADMIN_PASS = "Mario.CTH2026";

function generarCodigo() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "HZ-";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// ══════════════════════════════════════════════════════════════
// HORARIOS — turnos de 30 min, viernes hasta 1:30 PM
// ══════════════════════════════════════════════════════════════
const TARDE = ["11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30"];
const TARDE_VIE = ["11:30","12:00","12:30","13:00","13:30"];

const HORARIOS_POR_DIA = {
  0: [],
  1: ["09:00","10:50"],
  2: ["09:00","10:50","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30"],
  3: ["09:00","10:50","14:00","14:30","15:00","15:30"],
  4: ["09:00","10:50","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30"],
  5: ["09:00","10:50",...TARDE_VIE],
  6: [],
};

const HORARIOS_LABEL = {
  "09:00":"9:00 AM","10:50":"10:50 AM",
  "11:30":"11:30 AM",
  "12:00":"12:00 PM","12:30":"12:30 PM",
  "13:00":"1:00 PM","13:30":"1:30 PM",
  "14:00":"2:00 PM","14:30":"2:30 PM",
  "15:00":"3:00 PM","15:30":"3:30 PM",
};

const SERVICIOS = [
  { id:"corte",      label:"Corte de pelo",         precio:2.50, icon:"✂️" },
  { id:"cejas",      label:"Limpieza de cejas",      precio:1.00, icon:"🪮" },
  { id:"barba",      label:"Bigote / Barba",         precio:1.00, icon:"🪒" },
  { id:"cortecejas", label:"Corte + Cejas",          precio:3.50, icon:"✨" },
  { id:"combo",      label:"Corte + Barba",          precio:3.50, icon:"⭐" },
  { id:"full",       label:"Corte + Cejas + Barba",  precio:4.50, icon:"💈" },
];

const SECCIONES = ["9°","1°A","1°C","1°BD","1°E","2°A","2°C","2°BD","3°B","3°C"];
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS_CORTO = ["D","L","M","X","J","V","S"];
const DIAS_NOMBRE = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];

const C = {
  bg:"#0a0f0a",card:"#111811",cardB:"#1e2a1e",
  gold:"#f5c518",goldL:"#ffe566",goldD:"#a88200",
  green:"#2ecc71",greenD:"#1a7a42",
  text:"#f0f5f0",textM:"#8aab8a",textD:"#4a6a4a",
  red:"#e74c3c",
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
  body{background:#0a0f0a;font-family:'DM Sans',sans-serif;color:#f0f5f0;}
  input,textarea,button{font-family:'DM Sans',sans-serif;}
  button{cursor:pointer;}
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-thumb{background:#1a7a42;border-radius:4px;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes popIn{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}
  @keyframes notifIn{0%{transform:translateX(-50%) translateY(-60px);opacity:0}12%{transform:translateX(-50%) translateY(0);opacity:1}80%{opacity:1}100%{opacity:0;transform:translateX(-50%) translateY(-60px)}}
  @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}
  @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(245,197,24,.4)}70%{box-shadow:0 0 0 8px rgba(245,197,24,0)}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
`;

function hoyStr(){const h=new Date();return `${h.getFullYear()}-${String(h.getMonth()+1).padStart(2,"0")}-${String(h.getDate()).padStart(2,"0")}`;}
function fechaKey(y,m,d){return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;}
function getDiaSemana(fechaStr){const[y,m,d]=fechaStr.split("-").map(Number);return new Date(y,m-1,d).getDay();}
function formatPrecio(p){return p%1===0?`$${p}.00`:`$${p.toFixed(2)}`;}

const st={
  shell:{maxWidth:420,margin:"0 auto",minHeight:"100dvh",background:C.bg,display:"flex",flexDirection:"column",boxShadow:"0 0 80px rgba(46,204,113,.07)"},
  statusBar:{display:"flex",justifyContent:"space-between",padding:"8px 20px 4px",color:C.textD,fontSize:11},
  header:{display:"flex",alignItems:"center",gap:12,padding:"12px 20px",borderBottom:`1px solid ${C.cardB}`,background:"linear-gradient(180deg,#0d160d,#0a0f0a)"},
  tabs:{display:"flex",borderBottom:`1px solid ${C.cardB}`,background:"#0d110d"},
  tabBtn:{flex:1,padding:"12px 0",border:"none",background:"transparent",color:C.textM,fontSize:12,fontWeight:500,borderBottom:"2px solid transparent",transition:"all .2s"},
  tabActivo:{color:C.gold,borderBottom:`2px solid ${C.gold}`,background:"rgba(245,197,24,.05)"},
  body:{flex:1,overflowY:"auto",padding:"18px 16px 28px",display:"flex",flexDirection:"column"},
  navBtn:{background:C.card,border:`1px solid #2e3e2e`,color:C.gold,width:38,height:38,borderRadius:10,fontSize:22,display:"flex",alignItems:"center",justifyContent:"center"},
  grid7:{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:4},
  diaBtn:{background:C.card,border:`1px solid #1e2e1e`,borderRadius:10,padding:"8px 2px",textAlign:"center",fontSize:14,color:C.text,position:"relative",display:"flex",flexDirection:"column",alignItems:"center",gap:2,transition:"all .15s"},
  diaBtnHoy:{background:"rgba(46,204,113,.1)",border:`1.5px solid ${C.greenD}`,color:C.green,fontWeight:700},
  dotCita:{position:"absolute",bottom:4,left:"50%",transform:"translateX(-50%)",width:5,height:5,borderRadius:"50%",background:C.gold},
  back:{background:"none",border:"none",color:C.gold,fontSize:14,marginBottom:14,padding:0},
  subTitulo:{fontSize:13,color:C.textM,marginBottom:14},
  horaBtn:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 16px",borderRadius:12,border:"1px solid",background:C.card,width:"100%",transition:"all .15s"},
  horaBtnLibre:{borderColor:"#2e3e2e",color:C.text},
  horaBtnOcup:{borderColor:"#2a1a1a",background:"#1a1212",color:C.textD,cursor:"not-allowed",opacity:.7},
  pillResumen:{background:"rgba(245,197,24,.08)",border:`1px solid ${C.goldD}`,borderRadius:20,padding:"8px 14px",fontSize:13,color:C.goldL,textAlign:"center",marginBottom:18},
  labelField:{fontSize:12,color:C.textM,marginBottom:8,textTransform:"uppercase",letterSpacing:"1.5px"},
  srvBtn:{display:"flex",flexDirection:"column",alignItems:"center",gap:4,padding:"14px 8px",borderRadius:12,border:`1px solid #2a3a2a`,background:C.card,color:C.text,transition:"all .15s"},
  srvBtnActivo:{border:`1.5px solid ${C.gold}`,background:"rgba(245,197,24,.1)"},
  input:{width:"100%",background:C.card,border:`1px solid #2e3e2e`,borderRadius:10,padding:"12px 14px",color:C.text,fontSize:14,marginBottom:18,outline:"none"},
  secBtn:{padding:"8px 12px",borderRadius:10,border:`1px solid #2a3a2a`,background:C.card,color:C.textM,fontWeight:600,fontSize:13,transition:"all .15s"},
  secBtnActivo:{background:"rgba(46,204,113,.15)",border:`1.5px solid ${C.green}`,color:C.green},
  btnPrimary:{width:"100%",padding:"15px",borderRadius:12,background:C.gold,border:"none",color:"#0a0f0a",fontSize:15,fontWeight:700,letterSpacing:".5px",transition:"opacity .2s"},
  btnSecundario:{marginTop:12,width:"100%",padding:"13px",borderRadius:12,border:`1px solid ${C.goldD}`,background:"transparent",color:C.gold,fontSize:14,fontWeight:500},
  checkCircle:{width:72,height:72,borderRadius:"50%",background:"rgba(46,204,113,.15)",border:`2px solid ${C.green}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,color:C.green,margin:"0 auto"},
  resumenCard:{background:C.card,border:`1px solid ${C.cardB}`,borderRadius:14,padding:"14px 16px",textAlign:"left",marginBottom:8},
  notifBanner:{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",background:"#0d1f0d",border:`1px solid ${C.green}`,borderRadius:24,padding:"10px 20px",color:C.green,fontSize:13,fontWeight:500,zIndex:999,whiteSpace:"nowrap",animation:"notifIn 3.5s ease forwards"},
  spinner:{width:36,height:36,border:`3px solid ${C.cardB}`,borderTop:`3px solid ${C.gold}`,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"40px auto"},
};

// ══════════════════════════════════════════════════════════════
// SUBCOMPONENTES
// ══════════════════════════════════════════════════════════════

function Calendario({reservas,mesV,setMesV,anioV,setAnioV,setDiaSelec,setVista}){
  const hoy=new Date();
  const primerDia=new Date(anioV,mesV,1).getDay();
  const totalDias=new Date(anioV,mesV+1,0).getDate();
  const hoyS=hoyStr();
  const puedeAtras=!(anioV===hoy.getFullYear()&&mesV===hoy.getMonth());
  const celdas=[...Array(primerDia).fill(null),...Array.from({length:totalDias},(_,i)=>i+1)];
  return(
    <div style={{animation:"fadeUp .35s ease"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <button style={st.navBtn} disabled={!puedeAtras} onClick={()=>{mesV===0?(setMesV(11),setAnioV(a=>a-1)):setMesV(m=>m-1);}}>‹</button>
        <span style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700}}>{MESES[mesV]} {anioV}</span>
        <button style={st.navBtn} onClick={()=>{mesV===11?(setMesV(0),setAnioV(a=>a+1)):setMesV(m=>m+1);}}>›</button>
      </div>
      <div style={st.grid7}>{DIAS_CORTO.map(d=><div key={d} style={{textAlign:"center",fontSize:11,color:C.textD,fontWeight:600,padding:"4px 0"}}>{d}</div>)}</div>
      <div style={st.grid7}>
        {celdas.map((dia,i)=>{
          if(!dia)return <div key={`e${i}`}/>;
          const fecha=fechaKey(anioV,mesV,dia);
          const esHoy=fecha===hoyS;
          const pasado=fecha<hoyS;
          const diaSem=getDiaSemana(fecha);
          const cerrado=(HORARIOS_POR_DIA[diaSem]||[]).length===0;
          const nCitas=reservas.filter(r=>r.fecha===fecha).length;
          return(
            <button key={dia} disabled={pasado||cerrado}
              onClick={()=>{setDiaSelec({dia,fecha,label:`${dia} de ${MESES[mesV]}`,diaSem});setVista("horas");}}
              style={{...st.diaBtn,...(esHoy?st.diaBtnHoy:{}),  ...((pasado||cerrado)?{opacity:.25,cursor:"not-allowed"}:{})}}>
              <span>{dia}</span>
              {cerrado&&!pasado&&<span style={{fontSize:7,color:C.textD}}>cerrado</span>}
              {nCitas>0&&!pasado&&!cerrado&&<span style={st.dotCita}/>}
            </button>
          );
        })}
      </div>
      <div style={{marginTop:14,fontSize:11,color:C.textD}}>
        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span style={{width:6,height:6,borderRadius:"50%",background:C.gold,display:"inline-block"}}/>Días con citas</div>
        <div>📅 Lun · Mar · Mié · Jue · Vie &nbsp;·&nbsp; Sáb y Dom cerrado</div>
      </div>
    </div>
  );
}

function Horarios({reservas,diaSelec,setHoraSelec,setVista}){
  const horariosDelDia=HORARIOS_POR_DIA[diaSelec?.diaSem]||[];
  const citasDia=reservas.filter(r=>r.fecha===diaSelec?.fecha);
  return(
    <div style={{animation:"fadeUp .3s ease"}}>
      <button style={st.back} onClick={()=>setVista("cal")}>← {diaSelec?.label}</button>
      <p style={st.subTitulo}>{DIAS_NOMBRE[diaSelec?.diaSem]} · Elige una hora</p>
      <div style={{fontSize:11,color:C.textD,marginBottom:12,background:C.cardB,borderRadius:8,padding:"6px 10px"}}>
        ⏱ 30 min por turno &nbsp;·&nbsp; {diaSelec?.diaSem===5?"Cierre: 1:30 PM":"Cierre: 3:30 PM"}
      </div>
      {horariosDelDia.length===0
        ?<div style={{textAlign:"center",color:C.textD,padding:30}}>Este día no hay atención 🚫</div>
        :<div style={{display:"flex",flexDirection:"column",gap:10}}>
          {horariosDelDia.map(h=>{
            const cita=citasDia.find(r=>r.hora===h);
            const ocup=!!cita;
            return(
              <button key={h} disabled={ocup}
                onClick={()=>{setHoraSelec(h);setVista("form");}}
                style={{...st.horaBtn,...(ocup?st.horaBtnOcup:st.horaBtnLibre)}}>
                <span style={{fontSize:16,fontWeight:600}}>{HORARIOS_LABEL[h]}</span>
                {ocup
                  ?<span style={{fontSize:12,color:C.textD}}>✕ Ocupado — {cita?.nombre}</span>
                  :<span style={{fontSize:12,color:C.green}}>✓ Disponible</span>
                }
              </button>
            );
          })}
        </div>
      }
    </div>
  );
}

function Formulario({diaSelec,horaSelec,setVista,onConfirmar,guardando}){
  const [srvSelec,setSrvSelec]=useState(null);
  const [nombre,  setNombre]  =useState("");
  const [seccion, setSeccion] =useState("");
  const listo=nombre.trim()&&seccion&&srvSelec&&!guardando;
  return(
    <div style={{animation:"fadeUp .3s ease"}}>
      <button style={st.back} onClick={()=>setVista("horas")}>← {HORARIOS_LABEL[horaSelec]}</button>
      <p style={st.subTitulo}>Completa tu reserva</p>
      <div style={st.pillResumen}>📅 {diaSelec?.label} &nbsp;·&nbsp; 🕐 {HORARIOS_LABEL[horaSelec]}</div>
      <p style={st.labelField}>Servicio</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18}}>
        {SERVICIOS.map(s=>(
          <button key={s.id} onClick={()=>setSrvSelec(s.id)} style={{...st.srvBtn,...(srvSelec===s.id?st.srvBtnActivo:{})}}>
            <span style={{fontSize:24}}>{s.icon}</span>
            <span style={{fontSize:12,fontWeight:500,textAlign:"center"}}>{s.label}</span>
            <span style={{fontSize:16,fontWeight:700,color:C.gold}}>{formatPrecio(s.precio)}</span>
          </button>
        ))}
      </div>
      <p style={st.labelField}>Tu nombre</p>
      <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Escribe tu nombre completo" style={st.input}/>
      <p style={st.labelField}>Sección</p>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:24}}>
        {SECCIONES.map(s=>(
          <button key={s} onClick={()=>setSeccion(s)} style={{...st.secBtn,...(seccion===s?st.secBtnActivo:{})}}>{s}</button>
        ))}
      </div>
      <button onClick={()=>onConfirmar(nombre.trim(),seccion,SERVICIOS.find(s=>s.id===srvSelec))}
        disabled={!listo} style={{...st.btnPrimary,...(!listo?{opacity:.4,cursor:"not-allowed"}:{})}}>
        {guardando?"Guardando...":"Confirmar cita"}
      </button>
    </div>
  );
}

function Confirmacion({ultima,onNueva}){
  return(
    <div style={{animation:"popIn .4s cubic-bezier(.175,.885,.32,1.275)",textAlign:"center",padding:"10px 0"}}>
      <div style={st.checkCircle}>✓</div>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:26,color:C.gold,margin:"16px 0 6px"}}>¡Cita confirmada!</h2>
      <p style={{color:C.textM,fontSize:14,marginBottom:16}}>Te esperamos puntual 💈 Mario Sánchez</p>
      <div style={{background:"rgba(245,197,24,.08)",border:`2px dashed ${C.gold}`,borderRadius:16,padding:"16px",marginBottom:20,animation:"pulse 2s infinite"}}>
        <p style={{fontSize:11,color:C.textM,letterSpacing:"2px",textTransform:"uppercase",marginBottom:6}}>Tu código de cita</p>
        <p style={{fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:900,color:C.gold,letterSpacing:4}}>{ultima?.codigo}</p>
        <p style={{fontSize:11,color:C.red,marginTop:8,fontWeight:500}}>⚠️ Guardá este código — lo necesitarás para cancelar</p>
      </div>
      <div style={st.resumenCard}>
        {[
          {icon:"👤",label:"Nombre",val:ultima?.nombre},
          {icon:"🏷️",label:"Sección",val:`Sección ${ultima?.seccion}`},
          {icon:"📅",label:"Fecha",val:ultima?.fecha_label},
          {icon:"🕐",label:"Hora",val:HORARIOS_LABEL[ultima?.hora]},
          {icon:ultima?.servicio_icon,label:"Servicio",val:ultima?.servicio_label},
        ].map(({icon,label,val})=>(
          <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.cardB}`}}>
            <span style={{color:C.textM,fontSize:13}}>{icon} {label}</span>
            <span style={{fontWeight:500,fontSize:13}}>{val}</span>
          </div>
        ))}
        <div style={{display:"flex",justifyContent:"space-between",paddingTop:12,marginTop:4}}>
          <span style={{color:C.textM}}>Total</span>
          <span style={{color:C.gold,fontWeight:700,fontSize:20}}>{formatPrecio(ultima?.servicio_precio||0)}</span>
        </div>
      </div>
      <button onClick={onNueva} style={st.btnSecundario}>Reservar otra cita</button>
    </div>
  );
}

function Cancelacion({reservas,onCancelar}){
  const [codigo,    setCodigo]    =useState("");
  const [error,     setError]     =useState("");
  const [shake,     setShake]     =useState(false);
  const [encontrada,setEncontrada]=useState(null);
  const [cancelando,setCancelando]=useState(false);

  const buscar=()=>{
    const c=codigo.trim().toUpperCase();
    if(!c){setError("Ingresa tu código de cita.");return;}
    const res=reservas.find(r=>r.codigo===c);
    if(!res){setError("Código incorrecto. Revisá bien el código que recibiste.");setShake(true);setTimeout(()=>setShake(false),500);setEncontrada(null);}
    else{setError("");setEncontrada(res);}
  };
  const confirmar=async()=>{
    setCancelando(true);
    await onCancelar(encontrada);
    setEncontrada(null);setCodigo("");setCancelando(false);
  };

  return(
    <div style={{animation:"fadeUp .3s ease"}}>
      <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20,color:C.gold,marginBottom:6}}>Cancelar cita</h3>
      <p style={{...st.subTitulo,marginBottom:20}}>Ingresa el código único que recibiste al reservar</p>
      {!encontrada?(
        <>
          <div style={{animation:shake?"shake .4s ease":undefined}}>
            <p style={st.labelField}>Código de cita</p>
            <input value={codigo} onChange={e=>{setCodigo(e.target.value.toUpperCase());setError("");}}
              onKeyDown={e=>e.key==="Enter"&&buscar()} placeholder="Ej: HZ-A3K9"
              style={{...st.input,textAlign:"center",fontSize:22,fontWeight:700,letterSpacing:4,...(error?{borderColor:C.red}:{})}}/>
            {error&&<p style={{color:C.red,fontSize:12,marginTop:-12,marginBottom:16,textAlign:"center"}}>{error}</p>}
          </div>
          <button onClick={buscar} style={st.btnPrimary}>Buscar cita</button>
        </>
      ):(
        <div style={{animation:"fadeUp .3s ease"}}>
          <p style={{color:C.green,fontSize:13,marginBottom:16,textAlign:"center"}}>✓ Cita encontrada</p>
          <div style={st.resumenCard}>
            {[
              {icon:"👤",label:"Nombre",val:encontrada.nombre},
              {icon:"🏷️",label:"Sección",val:`Sección ${encontrada.seccion}`},
              {icon:"📅",label:"Fecha",val:encontrada.fecha_label},
              {icon:"🕐",label:"Hora",val:HORARIOS_LABEL[encontrada.hora]},
              {icon:encontrada.servicio_icon,label:"Servicio",val:encontrada.servicio_label},
            ].map(({icon,label,val})=>(
              <div key={label} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.cardB}`}}>
                <span style={{color:C.textM,fontSize:13}}>{icon} {label}</span>
                <span style={{fontWeight:500,fontSize:13}}>{val}</span>
              </div>
            ))}
          </div>
          <button onClick={confirmar} disabled={cancelando}
            style={{width:"100%",padding:"14px",borderRadius:12,background:"rgba(231,76,60,.15)",border:`1px solid ${C.red}`,color:C.red,fontWeight:700,fontSize:15,marginTop:8}}>
            {cancelando?"Cancelando...":"🗑️ Sí, cancelar esta cita"}
          </button>
          <button onClick={()=>{setEncontrada(null);setCodigo("");}} style={st.btnSecundario}>← Volver</button>
        </div>
      )}
    </div>
  );
}

function LoginAdmin({onLogin}){
  const [user,setUser]=useState("");
  const [pass,setPass]=useState("");
  const [error,setError]=useState(false);
  const [shake,setShake]=useState(false);
  const intentar=()=>{
    if(user.trim()===ADMIN_USER&&pass===ADMIN_PASS){onLogin();}
    else{setError(true);setShake(true);setTimeout(()=>setShake(false),500);}
  };
  return(
    <div style={{animation:"fadeUp .35s ease",display:"flex",flexDirection:"column",alignItems:"center",padding:"30px 0"}}>
      <div style={{width:72,height:72,borderRadius:"50%",overflow:"hidden",border:`2px solid ${C.gold}`,marginBottom:20}}>
        <img src="/logo.jpeg" alt="logo" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display="none";}}/>
      </div>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:C.gold,marginBottom:4}}>Área del Barbero</h2>
      <p style={{color:C.textD,fontSize:13,marginBottom:28}}>Acceso exclusivo para Mario Sánchez</p>
      <div style={{width:"100%",animation:shake?"shake .4s ease":undefined}}>
        <p style={st.labelField}>Usuario</p>
        <input value={user} onChange={e=>{setUser(e.target.value);setError(false);}} onKeyDown={e=>e.key==="Enter"&&intentar()}
          placeholder="Mario Sánchez" style={{...st.input,...(error?{borderColor:C.red}:{})}}/>
        <p style={st.labelField}>Contraseña</p>
        <input type="password" value={pass} onChange={e=>{setPass(e.target.value);setError(false);}} onKeyDown={e=>e.key==="Enter"&&intentar()}
          placeholder="••••••••••" style={{...st.input,...(error?{borderColor:C.red}:{})}}/>
        {error&&<p style={{color:C.red,fontSize:12,marginTop:-12,marginBottom:16,textAlign:"center"}}>⚠️ Usuario o contraseña incorrectos</p>}
        <button onClick={intentar} style={st.btnPrimary}>Ingresar</button>
      </div>
    </div>
  );
}

function PanelAdmin({reservas,onLogout,onEliminar}){
  const [panelTab,  setPanelTab]  =useState("citas");
  const [busq,      setBusq]      =useState("");
  const citasHoy=reservas.filter(r=>r.fecha===hoyStr()).length;

  const grupos=Object.entries(
    reservas.reduce((acc,r)=>{
      if(!acc[r.fecha])acc[r.fecha]=[];
      acc[r.fecha].push(r);
      return acc;
    },{})
  ).sort(([a],[b])=>a.localeCompare(b));

  const filtradas=busq.trim()?reservas.filter(r=>r.nombre.toLowerCase().includes(busq.toLowerCase())):null;

  return(
    <div style={{animation:"fadeUp .3s ease"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 4px 10px",borderBottom:`1px solid ${C.cardB}`,marginBottom:12}}>
        <div style={{width:42,height:42,borderRadius:"50%",overflow:"hidden",border:`1.5px solid ${C.greenD}`,flexShrink:0}}>
          <img src="/logo.jpeg" alt="" style={{width:"100%",height:"100%",objectFit:"cover"}} onError={e=>{e.target.style.display="none";}}/>
        </div>
        <div style={{flex:1}}>
          <div style={{fontWeight:600,fontSize:15}}>Mario Sánchez</div>
          <div style={{color:C.green,fontSize:11}}>● Administrador</div>
        </div>
        <div style={{background:"rgba(245,197,24,.15)",border:`1px solid ${C.goldD}`,borderRadius:20,padding:"4px 10px",fontSize:12,color:C.goldL,fontWeight:600}}>{citasHoy} hoy</div>
        <button onClick={onLogout} style={{background:"rgba(231,76,60,.15)",border:`1px solid ${C.red}`,borderRadius:8,padding:"4px 10px",color:C.red,fontSize:12}}>Salir</button>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:16}}>
        <input value={busq} onChange={e=>setBusq(e.target.value)} placeholder="Buscar por nombre..."
          style={{...st.input,marginBottom:0,flex:1,fontSize:13,padding:"10px 12px"}}/>
        {busq&&<button onClick={()=>setBusq("")} style={{background:C.cardB,border:`1px solid #2e3e2e`,borderRadius:10,padding:"0 12px",color:C.textM,fontSize:13}}>✕</button>}
      </div>

      {busq.trim()
        ?(filtradas?.length===0
            ?<p style={{color:C.textD,textAlign:"center",padding:20}}>No se encontró ninguna cita.</p>
            :filtradas?.map(r=><TarjetaAdmin key={r.id} r={r} onEliminar={()=>onEliminar(r)}/>)
          )
        :(grupos.length===0
            ?<p style={{color:C.textD,textAlign:"center",padding:30}}>No hay citas agendadas.</p>
            :grupos.map(([fecha,citas])=>(
              <div key={fecha} style={{marginBottom:20}}>
                <div style={{fontSize:11,color:C.gold,fontWeight:700,letterSpacing:"2px",textTransform:"uppercase",marginBottom:8,padding:"4px 0",borderBottom:`1px solid ${C.cardB}`}}>
                  📅 {citas[0]?.fecha_label||fecha}
                  <span style={{marginLeft:8,background:"rgba(245,197,24,.15)",borderRadius:10,padding:"1px 8px",fontSize:10}}>{citas.length} cita{citas.length!==1?"s":""}</span>
                </div>
                {[...citas].sort((a,b)=>a.hora.localeCompare(b.hora)).map(r=>(
                  <TarjetaAdmin key={r.id} r={r} onEliminar={()=>onEliminar(r)}/>
                ))}
              </div>
            ))
          )
      }
    </div>
  );
}

function TarjetaAdmin({r,onEliminar}){
  return(
    <div style={{...st.resumenCard,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontWeight:600,fontSize:14,marginBottom:2}}>{r.nombre}</div>
        <div style={{fontSize:12,color:C.textM}}>{r.servicio_icon} {r.servicio_label} · Sección {r.seccion}</div>
        <div style={{fontSize:12,color:C.textD,marginTop:2}}>🕐 {HORARIOS_LABEL[r.hora]} · 🔑 {r.codigo}</div>
      </div>
      <button onClick={onEliminar}
        style={{background:"rgba(231,76,60,.15)",border:`1px solid ${C.red}`,borderRadius:10,padding:"10px 12px",color:C.red,fontSize:18,flexShrink:0}}>
        🗑️
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// APP PRINCIPAL
// ══════════════════════════════════════════════════════════════
export default function App(){
  const hoy=new Date();
  const [tab,          setTab]          =useState("cliente");
  const [vista,        setVista]        =useState("cal");
  const [mesV,         setMesV]         =useState(hoy.getMonth());
  const [anioV,        setAnioV]        =useState(hoy.getFullYear());
  const [diaSelec,     setDiaSelec]     =useState(null);
  const [horaSelec,    setHoraSelec]    =useState(null);
  const [reservas,     setReservas]     =useState([]);
  const [ultima,       setUltima]       =useState(null);
  const [notif,        setNotif]        =useState(null);
  const [adminLogueado,setAdminLogueado]=useState(false);
  const [cargando,     setCargando]     =useState(true);
  const [guardando,    setGuardando]    =useState(false);

  const cargarReservas=async()=>{
    try{
      const data=await sb.getAll();
      const hoyS=hoyStr();
      // Borrar pasadas
      const pasadas=(data||[]).filter(r=>r.fecha<hoyS);
      for(const r of pasadas) await sb.delete(r.id);
      setReservas((data||[]).filter(r=>r.fecha>=hoyS));
    }catch(e){console.error(e);}
    setCargando(false);
  };

  useEffect(()=>{cargarReservas();},[]);

  const mostrarNotif=(txt)=>{setNotif(txt);setTimeout(()=>setNotif(null),3500);};

  const handleConfirmar=async(nombre,seccion,srv)=>{
    setGuardando(true);
    const codigo=generarCodigo();
    const nueva={
      nombre, seccion, fecha:diaSelec.fecha, hora:horaSelec,
      servicio_id:srv.id, servicio_label:srv.label,
      servicio_precio:srv.precio, servicio_icon:srv.icon,
      fecha_label:diaSelec.label, codigo
    };
    await sb.insert(nueva);
    await cargarReservas();
    setUltima(nueva);
    mostrarNotif(`✅ ¡Cita confirmada para ${nombre}!`);
    setGuardando(false);
    setVista("ok");
  };

  const handleCancelar=async(r)=>{
    await sb.delete(r.id);
    await cargarReservas();
    mostrarNotif(`🗑️ Cita de ${r.nombre} cancelada`);
  };

  const handleEliminar=async(r)=>{
    await sb.delete(r.id);
    await cargarReservas();
    mostrarNotif(`🗑️ Cita de ${r.nombre} eliminada`);
  };

  return(
    <>
      <style>{GLOBAL_CSS}</style>
      {notif&&<div style={st.notifBanner}>{notif}</div>}
      <div style={st.shell}>
        <div style={st.statusBar}>
          <span>{new Date().toLocaleTimeString("es-SV",{hour:"2-digit",minute:"2-digit"})}</span>
          <span style={{fontFamily:"'Playfair Display',serif",letterSpacing:1}}>✦ Barber Herzl</span>
          <span>🔋</span>
        </div>
        <div style={st.header}>
          <img src="/logo.jpeg" alt="Barber Herzl" style={{width:54,height:54,borderRadius:"50%",objectFit:"cover",border:`2px solid ${C.gold}`,flexShrink:0}} onError={e=>{e.target.style.display="none";}}/>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:900,color:C.gold}}>Barber Herzl</div>
            <div style={{fontSize:10,color:C.textD,letterSpacing:"2.5px",textTransform:"uppercase"}}>Mario Sánchez · Reservas</div>
          </div>
        </div>
        <div style={st.tabs}>
          {[{key:"cliente",label:"📅 Reservar"},{key:"cancelar",label:"🗑️ Cancelar"},{key:"barbero",label:"💈 Barbero"}].map(t=>(
            <button key={t.key} onClick={()=>{setTab(t.key);if(t.key==="cliente")setVista("cal");}}
              style={{...st.tabBtn,...(tab===t.key?st.tabActivo:{})}}>
              {t.label}
            </button>
          ))}
        </div>
        <div style={st.body}>
          {cargando ? <div style={st.spinner}/> : (
            <>
              {tab==="cliente"&&(
                <>
                  {vista==="cal"   &&<Calendario reservas={reservas} mesV={mesV} setMesV={setMesV} anioV={anioV} setAnioV={setAnioV} setDiaSelec={setDiaSelec} setVista={setVista}/>}
                  {vista==="horas" &&<Horarios reservas={reservas} diaSelec={diaSelec} setHoraSelec={setHoraSelec} setVista={setVista}/>}
                  {vista==="form"  &&<Formulario diaSelec={diaSelec} horaSelec={horaSelec} setVista={setVista} onConfirmar={handleConfirmar} guardando={guardando}/>}
                  {vista==="ok"    &&<Confirmacion ultima={ultima} onNueva={()=>{setVista("cal");setDiaSelec(null);setHoraSelec(null);}}/>}
                </>
              )}
              {tab==="cancelar"&&<Cancelacion reservas={reservas} onCancelar={handleCancelar}/>}
              {tab==="barbero"&&(adminLogueado
                ?<PanelAdmin reservas={reservas} onLogout={()=>setAdminLogueado(false)} onEliminar={handleEliminar}/>
                :<LoginAdmin onLogin={()=>setAdminLogueado(true)}/>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}