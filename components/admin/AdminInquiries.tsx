"use client";
import { useCallback, useEffect, useState } from "react";

type Inquiry = { id:string; full_name:string; phone:string; email:string|null; company:string|null; service_type:string|null; budget:string|null; timeline:string|null; description:string|null; reference_url:string|null; locale:string; status:string; private_notes:string; created_at:string };
type Payload = { inquiries: Inquiry[]; metrics: { total:number; new:number; last_30_days:number }; page:number; pageSize:number; total:number; totalPages:number };
const statuses = [["new","New"],["in-review","In review"],["contacted","Contacted"],["closed","Closed"]];
function safeReferenceHref(value: string | null) {
  if (!value) return null;
  try { const url = new URL(value); return url.protocol === "http:" || url.protocol === "https:" ? url.href : null; } catch { return null; }
}

type SecurityInfo = { rateLimitBuckets:number; ipAllowlisted:boolean; allowlistedIps:string[] };
type RateLimitStats = { buckets:number; adminLoginBuckets:number; oldestWindow:string|null };

// Collapsible security section. Data loads the first time it is opened, so the dashboard does not fetch it on every visit.
function SecuritySettings() {
  const [info,setInfo]=useState<SecurityInfo|null>(null); const [stats,setStats]=useState<RateLimitStats|null>(null); const [message,setMessage]=useState(""); const [busy,setBusy]=useState(false); const [loaded,setLoaded]=useState(false);
  const refresh=useCallback(async()=>{ try { const [securityResult,rateResult]=await Promise.all([fetch("/api/admin/security",{cache:"no-store"}),fetch("/api/admin/rate-limits",{cache:"no-store"})]); if(!securityResult.ok||!rateResult.ok) throw new Error("load_failed"); setInfo(await securityResult.json() as SecurityInfo); setStats(await rateResult.json() as RateLimitStats); setLoaded(true); } catch { setMessage("Could not load security settings."); } },[]);
  async function clearAll(){ if(!window.confirm("Clear all rate limits? Login and inquiry attempt counters will reset.")) return; setBusy(true); try { const result=await fetch("/api/admin/rate-limits",{method:"DELETE"}); if(!result.ok) throw new Error("clear_failed"); const payload=await result.json() as {cleared:number}; setMessage(`Cleared ${payload.cleared} rate-limit bucket${payload.cleared===1?"":"s"}.`); await refresh(); } catch { setMessage("Could not clear rate limits. Try again."); } finally { setBusy(false); } }
  const allowlistCount=info?.allowlistedIps.length ?? 0;
  return <details className="admin-inquiry admin-security" style={{marginTop:"2rem"}} onToggle={(event)=>{ if(event.currentTarget.open && !loaded) void refresh(); }}>
    <summary><span><strong>Security settings</strong><small>IP allowlist and rate limits</small></span></summary>
    <div className="admin-detail">
      {message&&<p role="status" className="admin-notice">{message}</p>}
      {!loaded&&!message&&<p>Loading security settings…</p>}
      {loaded&&info&&stats&&<>
        <dl>
          <div><dt>IP allowlist</dt><dd>{allowlistCount>0?`Enabled (${allowlistCount} ${allowlistCount===1?"entry":"entries"})`:"Not set"}</dd></div>
          <div><dt>Rate limit buckets</dt><dd>{stats.buckets} active · {stats.adminLoginBuckets} likely admin login</dd></div>
          <div><dt>Allowlisted IPs</dt><dd>{allowlistCount>0?info.allowlistedIps.map((ip)=><code key={ip} style={{marginInlineEnd:"0.5rem"}}>{ip}</code>):"None"}</dd></div>
        </dl>
        <p className="admin-description">{info.ipAllowlisted?"Your IP is allowlisted — rate limits do not apply to your login attempts":"Add your IP to ADMIN_IP_ALLOWLIST in .env.local to bypass rate limits"}</p>
      </>}
      <button type="button" onClick={()=>void clearAll()} disabled={busy||!loaded}>Clear all rate limits</button>
    </div>
  </details>;
}

export function AdminInquiries() {
  const [data,setData]=useState<Payload|null>(null); const [query,setQuery]=useState(""); const [status,setStatus]=useState("all"); const [page,setPage]=useState(1); const [notice,setNotice]=useState(""); const [busy,setBusy]=useState(false);
  const load=useCallback(async(targetPage=page)=>{ setBusy(true); try { const params=new URLSearchParams({q:query,status,page:String(targetPage)}); const result=await fetch(`/api/admin/inquiries?${params}`,{cache:"no-store"}); if(result.status===401){window.location.replace("/admin/login");return;} if(!result.ok)throw new Error("Unable to load inquiries. Check database configuration."); const payload:Payload=await result.json(); setData(payload); setPage(payload.page); setNotice(""); } catch(error){setNotice(error instanceof Error?error.message:"Unable to load inquiries.");} finally{setBusy(false);} },[query,status,page]);
  useEffect(()=>{void load();},[load]);
  async function patch(item:Inquiry, change:Record<string,string>){ const response=await fetch(`/api/admin/inquiries/${item.id}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(change)}); if(!response.ok){setNotice("Could not save this change. Try again.");return;} await load(); }
  return <section className="admin-dashboard">
    <div className="admin-main"><div className="admin-heading"><div><p>Private workspace</p><h1>Project inquiries</h1></div><button onClick={()=>void load()} disabled={busy}>Refresh</button></div>
      <div className="admin-metrics"><article><span>All inquiries</span><strong>{data?.metrics.total ?? "—"}</strong></article><article><span>New</span><strong>{data?.metrics.new ?? "—"}</strong></article><article><span>Last 30 days</span><strong>{data?.metrics.last_30_days ?? "—"}</strong></article></div>
      <div className="admin-filters"><label>Search<input value={query} onChange={(event)=>{setPage(1);setQuery(event.target.value);}} placeholder="Name, phone, email, company"/></label><label>Status<select value={status} onChange={(event)=>{setPage(1);setStatus(event.target.value);}}><option value="all">All statuses</option>{statuses.map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label></div>
      {notice&&<p role="alert" className="admin-notice">{notice}</p>}{busy&&!data&&<p>Loading inquiries…</p>}{data?.inquiries.length===0&&<p className="admin-empty">No inquiries match these filters.</p>}
      <div className="admin-list">{data?.inquiries.map((item)=><details className="admin-inquiry" key={item.id}><summary><span><strong>{item.full_name}</strong><small>{item.company||item.phone}</small></span><span className="admin-summary-meta"><small>{new Date(item.created_at).toLocaleString()}</small><em>{item.status}</em></span></summary><div className="admin-detail"><dl>{[["Phone",item.phone],["Email",item.email],["Company",item.company],["Service",item.service_type],["Budget",item.budget],["Timeline",item.timeline],["Locale",item.locale],["Reference",item.reference_url]].filter((row)=>row[1]).map(([key,value])=>{const href=key==="Reference"?safeReferenceHref(String(value)):null;return <div key={key}><dt>{key}</dt><dd>{href?<a href={href} target="_blank" rel="noreferrer">{value}</a>:value}</dd></div>;})}</dl>{item.description&&<p className="admin-description">{item.description}</p>}<label>Status<select value={item.status} onChange={(event)=>void patch(item,{status:event.target.value})}>{statuses.map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label><label>Private notes<textarea defaultValue={item.private_notes} key={`${item.id}-${item.private_notes}`} maxLength={5000} rows={3}/></label><button onClick={(event)=>{const textarea=event.currentTarget.parentElement?.querySelector("textarea");if(textarea)void patch(item,{privateNotes:textarea.value});}}>Save notes</button></div></details>)}</div>
      {data&&<nav className="admin-pagination" aria-label="Inquiry pages"><p aria-live="polite">Page {data.page} of {data.totalPages} · {data.total} inquiries</p><div><button type="button" onClick={()=>setPage((current)=>Math.max(1,current-1))} disabled={busy||page<=1} aria-label="Previous inquiry page">Previous</button><button type="button" onClick={()=>setPage((current)=>Math.min(data.totalPages,current+1))} disabled={busy||page>=data.totalPages} aria-label="Next inquiry page">Next</button></div></nav>}
      <SecuritySettings/>
    </div></section>;
}
