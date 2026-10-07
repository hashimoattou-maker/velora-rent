'use client';
import { createContext, useContext, useEffect, useState } from 'react';
const Ctx = createContext(null);
const load = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; }; };
export function StoreProvider({ children }) {
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
    setGifts(load('velora_gifts', [{ code:'VELO-500', amount:500 }]));
  }, []);
  useEffect(() => { localStorage.setItem('velora_bookings', JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem('velora_favs', JSON.stringify(favs)); }, [favs]);
  const login = (u) => { setUser(u); localStorage.setItem('velora_user', JSON.stringify(u)); };
  const logout = () => { setUser(null); localStorage.removeItem('velora_user'); };
  const addBooking = (b) => {
    const code = 'VR-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    const nb = { ...b, code, created_at: new Date().toISOString() };
    setBookings((p) => [nb, ...p]);
    setPoints((p) => { const n = p + Math.floor(b.total || 0); localStorage.setItem('velora_points', JSON.stringify(n)); return n; });
    return code;
  };
  const cancelBooking = (code) => setBookings((p) => p.filter((b) => b.code !== code));
  return <Ctx.Provider value={{ user, login, logout, bookings, addBooking, cancelBooking, favs, setFavs, points, identity, setIdentity, gifts, setGifts }}>{children}</Ctx.Provider>;
}
export const useStore = () => useContext(Ctx);
