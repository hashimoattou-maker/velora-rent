'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { api, serverAvailable, setToken, getToken } from './api';

const Ctx = createContext(null);
const load = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; }; };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

export function StoreProvider({ children }) {
  const [mode, setMode] = useState('local'); // local (demo) | server (Hostinger MySQL)
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [favs, setFavs] = useState([]);
  const [points, setPoints] = useState(0);
  const [identity, setIdentity] = useState(false);
  const [gifts, setGifts] = useState([]);

  useEffect(() => {
    setUser(load('velora_user', null));
    setBookings(load('velora_bookings', []));
    setFavs(load('velora_favs', []));
    setPoints(load('velora_points', 350));
    setIdentity(load('velora_identity', false));
    setGifts(load('velora_gifts', [{ code: 'VELO-500', amount: 500 }]));
    serverAvailable().then((ok) => {
      if (ok) {
        setMode('server');
        if (getToken()) refreshServer().catch(() => {});
      }
    });
  }, []);
  useEffect(() => { save('velora_bookings', bookings); }, [bookings]);
  useEffect(() => { save('velora_favs', favs); }, [favs]);

  const refreshServer = async () => {
    const m = await api.me();
    setUser(m.user);
    const b = await api.myBookings();
    setBookings(b.bookings || []);
    const a = await api.account();
    setPoints(a.user.points);
    setIdentity(!!a.user.identity_verified);
    setGifts(a.gifts || []);
  };

  // ---- local demo ----
  const loginLocal = (u) => { setUser(u); save('velora_user', u); };

  // ---- server (Hostinger MySQL) ----
  const loginServer = async (email, pass) => {
    const r = await api.login({ email, pass });
    setToken(r.token); setUser(r.user);
    await refreshServer();
    return r.user;
  };
  const registerServer = async (d) => {
    const r = await api.register(d);
    setToken(r.token); setUser(r.user);
    await refreshServer();
    return r.user;
  };
  const socialServer = async (d) => {
    const r = await api.social(d);
    setToken(r.token); setUser(r.user);
    await refreshServer();
    return r.user;
  };
  const logout = () => { setUser(null); setToken(null); try { localStorage.removeItem('velora_user'); } catch {} };

  const addBooking = async (b) => {
    if (mode === 'server' && getToken()) {
      const r = await api.book({ car_slug: b.car_slug, start: b.start, end: b.end, gps: !!b.gps, baby: !!b.baby, full: b.full !== false, pay: b.pay });
      const nb = { code: r.code, car: b.car, city: b.city, start: b.start, end: b.end, days: r.days, total: r.total, status: r.status };
      setBookings((p) => [nb, ...p]);
      setPoints((p) => p + r.total);
      return { code: r.code, total: r.total };
    }
    const code = 'VR-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const nb = { ...b, code, created_at: new Date().toISOString() };
    setBookings((p) => [nb, ...p]);
    setPoints((p) => { const n = p + Math.floor(b.total || 0); save('velora_points', n); return n; });
    return { code, total: b.total };
  };

  const cancelBooking = async (code) => {
    if (mode === 'server' && getToken()) { try { await api.cancelBooking(code); } catch {} }
    setBookings((p) => p.filter((b) => b.code !== code));
  };

  const verifyIdentity = async () => {
    if (mode === 'server' && getToken()) { await api.verifyIdentity(); setIdentity(true); return; }
    setIdentity(true); save('velora_identity', true);
  };

  const addGift = async (amount = 500) => {
    if (mode === 'server' && getToken()) {
      const r = await api.gift(amount);
      setGifts((p) => [{ code: r.code, amount: r.amount }, ...p]);
      return;
    }
    const c = { code: 'VELO-' + Math.floor(Math.random() * 9000 + 1000), amount };
    const n = [...gifts, c]; setGifts(n); save('velora_gifts', n);
  };

  return (
    <Ctx.Provider value={{ mode, user, login: loginLocal, loginServer, registerServer, socialServer, logout, bookings, addBooking, cancelBooking, favs, setFavs, points, identity, setIdentity, verifyIdentity, gifts, setGifts, addGift, refreshServer, isServer: () => mode === 'server' }}>
      {children}
    </Ctx.Provider>
  );
}
export const useStore = () => useContext(Ctx);
