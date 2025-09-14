import React, { useEffect, useMemo, useRef, useState } from "react";
import "./AdminCalendar.css";
import API from '../../api/axios';
import Swal from '../../utils/swalWithFont';


// --- Config -----------------------------------------------------------------
const OPENING_HOUR = 14;         // 10:00
const LATE_CLOSE_HOUR = 26;      // 26:00 => 02:00 next day
const MINUTES_PER_STEP = 30;     // grid snap step
const PIXELS_PER_MINUTE = 2;     // timeline scale
const MIN_DURATION_MINUTES = 60; // minimum reservation length
const MINUTES_IN_DAY = 24 * 60;
const ROW_HEIGHT = 24;           // keep in sync with CSS --row-height

const CREATE_MODE = 'auto';
const ADMIN_CREATE_ENDPOINT = '/admin/bookings';
const PUBLIC_CREATE_ENDPOINT = '/bookings';

// --- Utils ------------------------------------------------------------------
const pad2 = (n) => (n < 10 ? `0${n}` : `${n}`);
const toTimeString = (minsFromMidnight) => {
  let m = Math.round(minsFromMidnight);
  const norm = ((m % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  const hh = Math.floor(norm / 60);
  const mm = norm % 60;
  return `${pad2(hh)}:${pad2(mm)}`;
};
const snap = (mins, step = MINUTES_PER_STEP) => Math.round(mins / step) * step;
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const dateOffset = (yyyyMmDd, days) => {
  const d = new Date(yyyyMmDd + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toJSON().slice(0, 10);
};
const getYyyyMmDdLocal = (d) => {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
};
const buildLocalDate = (yyyyMmDd, hhmm) => {
  const [H, M] = hhmm.split(":").map(Number);
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  return new Date(y, m - 1, d, H, M, 0, 0);
};

// Timeline math
const dayStart = OPENING_HOUR * 60;
const dayEnd = LATE_CLOSE_HOUR * 60; // can exceed 24h
const timelineMinutes = dayEnd - dayStart;
const timelineWidthPx = timelineMinutes * PIXELS_PER_MINUTE;

export default function ReservationSchedulerWithApi({ defaultFilter = "upcoming" }) {
  const [filterBy, setFilterBy] = useState(defaultFilter);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [bookings, setBookings] = useState([]); // backend shape
  const [tables, setTables] = useState([]);     // backend shape

  const [selectedDate, setSelectedDate] = useState(getYyyyMmDdLocal(new Date()));

  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [inputs, setInputs] = useState({
    date: getYyyyMmDdLocal(new Date()),
    startTime: "12:00",
    duration: "60",
    tableNumber: "1",
    players: "2",
    game: "",
    userId: "",
    contactName: "Walk in",
    contactPhone: "+358505662613",
  });

  const [dragState, setDragState] = useState(null);
  const scrollRef = useRef(null);
  const gridRef = useRef(null);

  // Fetch --------------------------------------------------------------------
  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      setError(null);
      try {
        const bookingsEndpoint = filterBy === "past" ? "/admin/past-bookings" : "/admin/upcoming-bookings";
        const [bookingsResponse, tablesResponse] = await Promise.all([
          API.get(bookingsEndpoint),
          API.get("/admin/tables"),
        ]);
        const sortedTables = [...(tablesResponse.data || [])].sort((a, b) => a.number - b.number);
        setTables(sortedTables);
        setBookings(bookingsResponse.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [filterBy]);

  // Helpers: table mapping ---------------------------------------------------
  const findTableById = (id) => tables.find((t) => t._id === id);
  const findTableByNumber = (num) => tables.find((t) => String(t.number) === String(num));
  const getTableNumberFromBooking = (b) => {
    const id = typeof b.tableId === "object" && b.tableId?._id ? b.tableId._id : b.tableId;
    return findTableById(id)?.number ?? "";
  };
  const getTableIdFromNumber = (num) => findTableByNumber(num)?._id;

  // Filter bookings to selected date incl. early next day -------------------
  const MINUTES_IN_DAY = 24 * 60; // scope for use
  const filtered = useMemo(() => {
    const nextDate = dateOffset(selectedDate, 1);
    const lateWindow = dayEnd - MINUTES_IN_DAY; // e.g., 120 for 02:00
    return bookings.filter((b) => {
      const st = new Date(b.startTime);
      const bDate = getYyyyMmDdLocal(st);
      if (bDate === selectedDate) return true;
      if (bDate === nextDate) {
        const mins = st.getHours() * 60 + st.getMinutes();
        return mins < lateWindow;
      }
      return false;
    });
  }, [bookings, selectedDate]);

  // Hours --------------------------------------------------------------------
  const hours = useMemo(() => {
    const arr = [];
    for (let m = dayStart; m <= dayEnd; m += 60) arr.push(m);
    return arr;
  }, []);

  // Form handlers ------------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectBooking = (b) => {
    setSelectedBookingId(b._id);
    const st = new Date(b.startTime);
    const et = new Date(b.endTime);
    const duration = Math.max(1, Math.round((et - st) / 60000));
    const hh = pad2(st.getHours());
    const mm = pad2(st.getMinutes());
    setInputs({
      date: getYyyyMmDdLocal(st),
      startTime: `${hh}:${mm}`,
      duration: String(duration),
      tableNumber: String(getTableNumberFromBooking(b) || ""),
      players: String(b.players ?? ""),
      game: b.game ?? "",
      userId: typeof b.userId === "object" ? b.userId?._id ?? "" : b.userId ?? "",
      contactName: b.contactName ?? "",
      contactPhone: b.contactPhone ?? "",
    });
  };

  // Build payloads -----------------------------------------------------------
  const buildIsoPayload = () => {
    const durM = Math.max(parseInt(inputs.duration || "0", 10), MIN_DURATION_MINUTES);
    const startLocal = buildLocalDate(inputs.date, inputs.startTime);
    const endLocal = new Date(startLocal.getTime() + durM * 60000);
    const tableId = getTableIdFromNumber(inputs.tableNumber);
    return {
      startTime: startLocal.toISOString(),
      endTime: endLocal.toISOString(),
      date: startLocal.toISOString(),
      contactName: inputs.contactName || "",
      contactPhone: inputs.contactPhone || "",
      players: inputs.players ? Number(inputs.players) : undefined,
      game: inputs.game || "",
      tableId,
      userId: inputs.userId || undefined,
    };
  };

  const buildSplitPayload = () => {
    // Matches your earlier POC shape
    const parsedPlayers = parseInt(inputs.players, 10);
    return {
      date: inputs.date,                 // 'YYYY-MM-DD'
      startTime: inputs.startTime,       // 'HH:mm'
      duration: Number(inputs.duration), // minutes
      tableNumber: Number(inputs.tableNumber),
      players: isNaN(parsedPlayers) ? 1 : Math.max(1, parsedPlayers),
      game: inputs.game || null,
      userId: inputs.userId || null,
      contactName: inputs.contactName || "",
      contactPhone: inputs.contactPhone || "",
    };
  };

  // Create -------------------------------------------------------------------
  const handleAdd = async (e) => {
    e.preventDefault();

    // quick client-side checks
    const durOk = Number(inputs.duration) >= 60 && Number(inputs.duration) % 30 === 0;
    if (!durOk) {
      await Swal.fire({ icon: 'error', title: 'Invalid duration', text: 'Duration must be ≥ 60 and in steps of 30.' });
      return;
    }

    try {
      if (CREATE_MODE === 'iso' || CREATE_MODE === 'auto') {
        const isoPayload = buildIsoPayload();
        if (!isoPayload.tableId) {
          await Swal.fire({ icon: 'error', title: 'Missing table', text: 'Table number does not match a known table.' });
          return;
        }
        // try admin create first
        const res = await API.post(ADMIN_CREATE_ENDPOINT, isoPayload);
        setBookings((prev) => [...prev, res.data ?? isoPayload]);
        setSelectedBookingId(null);
        Swal.fire({ icon: 'success', title: 'Booking Created', timer: 1200, showConfirmButton: false });
        // reset form a bit
        setInputs((s) => ({ ...s, players: "2", game: "", contactName: "", contactPhone: "" }));
        return;
      }
    } catch (err) {
      // If auto, fall back to split on 4xx/404
      const status = err?.response?.status;
      const shouldFallback = CREATE_MODE === 'auto' && status && String(status).startsWith('4');
      if (!shouldFallback) {
        console.error('Create (iso) failed', err);
        const msg = err?.response?.data?.message || 'Error creating booking';
        await Swal.fire({ icon: 'error', title: 'Create Failed', text: msg });
        return;
      }
      console.warn('Create (iso) failed, attempting split payload fallback…', err?.response?.data || err);
    }

    // split fallback or forced split mode
    try {
      const splitPayload = buildSplitPayload();
      const res2 = await API.post(PUBLIC_CREATE_ENDPOINT, splitPayload);
      setBookings((prev) => [...prev, res2.data ?? splitPayload]);
      setSelectedBookingId(null);
      Swal.fire({ icon: 'success', title: 'Booking Created', timer: 1200, showConfirmButton: false });
      setInputs((s) => ({ ...s, players: "2", game: "", contactName: "", contactPhone: "" }));
    } catch (err2) {
      console.error('Create (split) failed', err2);
      const msg = err2?.response?.data?.message || 'Error creating booking';
      await Swal.fire({ icon: 'error', title: 'Create Failed', text: msg });
    }
  };

  // Update / Delete -------------------------------------
  const composePayloadFromInputs = () => buildIsoPayload();

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedBookingId) return;
    try {
      const payload = composePayloadFromInputs();
      await API.put(`/admin/bookings/${selectedBookingId}`, payload);
      setBookings((prev) => prev.map((b) => (b._id === selectedBookingId ? { ...b, ...payload, _id: b._id } : b)));
      setSelectedBookingId(null);
      Swal.fire({ icon: 'success', title: 'Booking Updated', text: 'The booking has been successfully updated.', timer: 1200, showConfirmButton: false });
    } catch (err) {
      console.error("Update failed", err);
      const msg = err?.response?.data?.message || 'Something went wrong while updating the booking.';
      await Swal.fire({ icon: 'error', title: 'Update Failed', text: msg });
    }
  };

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      const result = await Swal.fire({
        title: 'Delete booking?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
      });
      if (!result.isConfirmed) return;

      await API.delete(`/admin/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
      if (selectedBookingId === id) setSelectedBookingId(null);
      Swal.fire({ icon: 'success', title: 'Deleted', text: 'The booking has been deleted.', timer: 1200, showConfirmButton: false });
    } catch (err) {
      console.error('Delete failed', err);
      const msg = err?.response?.data?.message || 'Something went wrong while deleting the booking.';
      await Swal.fire({ icon: 'error', title: 'Delete Failed', text: msg });
    }
  };

  // Drag & Resize  ----------------------------------------------
  const startDrag = (e, b, mode) => {
    e.stopPropagation();
    const scrollEl = scrollRef.current;
    const gridEl = gridRef.current;
    if (!scrollEl || !gridEl) return;

    const gridRect = gridEl.getBoundingClientRect();
    const xOnGrid = e.clientX - gridRect.left + scrollEl.scrollLeft;
    const yOnGrid = e.clientY - gridRect.top + scrollEl.scrollTop;

    const st = new Date(b.startTime);
    const baseDateStr = getYyyyMmDdLocal(st);
    const nextDateStr = dateOffset(selectedDate, 1);
    const MINUTES_IN_DAY_LOC = 24 * 60;
    const isNextDayEarly = baseDateStr === nextDateStr && (st.getHours() * 60 + st.getMinutes()) < (dayEnd - MINUTES_IN_DAY_LOC);

    const baseStartM = st.getHours() * 60 + st.getMinutes();
    const startM = isNextDayEarly ? MINUTES_IN_DAY_LOC + baseStartM : baseStartM;
    const durationM = Math.max(1, Math.round((new Date(b.endTime) - st) / 60000));

    const tableId = typeof b.tableId === "object" && b.tableId?._id ? b.tableId._id : b.tableId;
    const initialTableIdx = Math.max(0, tables.findIndex((t) => t._id === tableId));

    setDragState({
      id: b._id,
      mode, // 'move' | 'resize-left' | 'resize-right'
      startMouseX: xOnGrid,
      startMouseY: yOnGrid,
      initialStartM: startM,
      initialDurationM: durationM,
      initialTableIdx,
      draftStartM: startM,
      draftDurationM: durationM,
      draftTableIdx: initialTableIdx,
    });
  };

  useEffect(() => {
    if (!dragState) return;

    const onMove = (e) => {
      const scrollEl = scrollRef.current;
      const gridEl = gridRef.current;
      if (!scrollEl || !gridEl) return;
      const gridRect = gridEl.getBoundingClientRect();
      const xOnGrid = e.clientX - gridRect.left + scrollEl.scrollLeft;
      const yOnGrid = e.clientY - gridRect.top + scrollEl.scrollTop;
      const dx = xOnGrid - dragState.startMouseX; // px
      const dy = yOnGrid - dragState.startMouseY; // px

      const dMinutes = Math.round(dx / PIXELS_PER_MINUTE);

      let draftStartM = dragState.initialStartM;
      let draftDurationM = dragState.initialDurationM;
      let draftTableIdx = dragState.initialTableIdx;

      if (dragState.mode === "move") {
        draftStartM = snap(draftStartM + dMinutes);
        draftStartM = clamp(draftStartM, dayStart, dayEnd - draftDurationM);
        const dRows = Math.round(dy / ROW_HEIGHT);
        draftTableIdx = clamp(dragState.initialTableIdx + dRows, 0, tables.length - 1);
      } else if (dragState.mode === "resize-left") {
        const newStartRaw = dragState.initialStartM + dMinutes;
        const newStart = clamp(snap(newStartRaw), dayStart, dragState.initialStartM + draftDurationM - MIN_DURATION_MINUTES);
        const newDuration = draftDurationM + (dragState.initialStartM - newStart);
        draftStartM = newStart;
        draftDurationM = clamp(snap(newDuration), MIN_DURATION_MINUTES, dayEnd - newStart);
      } else if (dragState.mode === "resize-right") {
        const newDurRaw = dragState.initialDurationM + dMinutes;
        const newDur = clamp(snap(newDurRaw), MIN_DURATION_MINUTES, dayEnd - draftStartM);
        draftDurationM = newDur;
      }

      setDragState((s) => ({ ...s, draftStartM, draftDurationM, draftTableIdx }));
    };

    const onUp = async () => {
      const ds = { ...dragState };
      const noChange = ds.draftStartM === ds.initialStartM && ds.draftDurationM === ds.initialDurationM && ds.draftTableIdx === ds.initialTableIdx;
      if (noChange) { setDragState(null); return; }

      const targetDateStr = ds.draftStartM >= MINUTES_IN_DAY ? dateOffset(selectedDate, 1) : selectedDate;
      const localStart = buildLocalDate(targetDateStr, toTimeString(ds.draftStartM));
      const localEnd = new Date(localStart.getTime() + ds.draftDurationM * 60000);
      const targetTableId = tables[ds.draftTableIdx]?._id;

      const current = bookings.find((x) => x._id === ds.id);
      if (!current) { setDragState(null); return; }
      const prevSnapshot = { ...current };

      const payload = {
        startTime: localStart.toISOString(),
        endTime: localEnd.toISOString(),
        date: localStart.toISOString(),
        tableId: targetTableId,
        contactName: current.contactName,
        contactPhone: current.contactPhone,
        players: current.players,
        game: current.game,
        userId: current.userId,
      };

      setBookings((prev) => prev.map((x) => (x._id === ds.id ? { ...x, ...payload, _id: x._id } : x)));
      setDragState(null);

      try {
        await API.put(`/admin/bookings/${ds.id}`, payload);
        Swal.fire({ icon: 'success', title: 'Booking Updated', timer: 800, showConfirmButton: false });
      } catch (err) {
        console.error('Drag update failed', err);
        setBookings((prev) => prev.map((x) => (x._id === ds.id ? prevSnapshot : x)));
        await Swal.fire({ icon: 'error', title: 'Update Failed', text: 'Something went wrong while updating the booking.' });
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp, { once: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragState, bookings, tables, selectedDate]);

  // Render helpers -----------------------------------------------------------
  const renderBookingBar = (b) => {
    const st = new Date(b.startTime);
    const et = new Date(b.endTime);
    const minsFromMidnight = st.getHours() * 60 + st.getMinutes();
    const durationM = Math.max(1, Math.round((et - st) / 60000));

    const baseDateStr = getYyyyMmDdLocal(st);
    const nextDateStr = dateOffset(selectedDate, 1);

    let leftM = minsFromMidnight - dayStart;
    if (baseDateStr === nextDateStr && minsFromMidnight < (dayEnd - MINUTES_IN_DAY)) {
      leftM = MINUTES_IN_DAY + minsFromMidnight - dayStart;
    }
    let left = leftM * PIXELS_PER_MINUTE;
    let width = durationM * PIXELS_PER_MINUTE;

    const tid = typeof b.tableId === "object" && b.tableId?._id ? b.tableId._id : b.tableId;
    let idx = Math.max(0, tables.findIndex((t) => t._id === tid));
    let top = idx * ROW_HEIGHT + 6;

    if (dragState && dragState.id === b._id) {
      left = (dragState.draftStartM - dayStart) * PIXELS_PER_MINUTE;
      width = dragState.draftDurationM * PIXELS_PER_MINUTE;
      idx = dragState.draftTableIdx;
      top = idx * ROW_HEIGHT + 6;
    }

    const tableNumber = tables[idx]?.number ?? "?";

    return (
      <div
        key={b._id}
        className={`booking ${selectedBookingId === b._id ? "selected" : ""}`}
        style={{ left, width, top }}
        onMouseDown={(e) => startDrag(e, b, "move")}
        onClick={(e) => { e.stopPropagation(); handleSelectBooking(b); }}
        title={`Table #${tableNumber} | ${b.contactName || "(no name)"} | ${st.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} • ${durationM}m`}
      >
        <div className="grip left" onMouseDown={(e) => startDrag(e, b, "resize-left")} />
        <div className="label">#{tableNumber} • {b.contactName || "Unnamed"} • {b.players ?? "?"}p</div>
        <div className="grip right" onMouseDown={(e) => startDrag(e, b, "resize-right")} />
      </div>
    );
  };

  if (loading) return <div className="scheduler-root"><div className="form">Loading…</div></div>;
  if (error) return <div className="scheduler-root"><div className="form">{error}</div></div>;

  return (
    <div className="scheduler-root" onClick={() => setSelectedBookingId(null)}>
      <div className="toolbar">
        <div className="left">
          <label>Admin date: </label>
          <input type="date" min={getYyyyMmDdLocal(new Date())} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} style={{ marginLeft: 8 }}>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
        </div>
        <div className="right">
          <em>Drag bars to move; drag ends to resize; drag vertically to change table.</em>
        </div>
      </div>

      <div className="layout">
        <div className="left-col">
          <div className="table-label header">Table</div>
          {tables.map((t) => (
            <div key={t._id} className="table-label" title={`Cap ${t.capacity} • ${t.location}`}>
              #{t.number} {"("}{t.capacity}{")"}
            </div>
          ))}
        </div>

        <div className="right-col" ref={scrollRef}>
          <div className="hours" style={{ width: timelineWidthPx }}>
            {hours.map((m) => (
              <div key={m} className="hour" style={{ left: (m - dayStart) * PIXELS_PER_MINUTE }}>
                {toTimeString(m)}
              </div>
            ))}
          </div>

          <div className="grid" ref={gridRef} style={{ width: timelineWidthPx, height: tables.length * ROW_HEIGHT + "px" }}>
            {Array.from({ length: timelineMinutes / 30 + 1 }, (_, i) => (
              <div key={i} className={`vline ${i % 2 === 0 ? "vline-hour-half" : ""}`} style={{ left: i * 30 * PIXELS_PER_MINUTE }} />
            ))}

            {tables.map((t, idx) => (
              <div key={t._id} className={`row ${idx % 2 ? "row-alt" : ""}`} style={{ top: idx * ROW_HEIGHT, height: ROW_HEIGHT }} />
            ))}

            {filtered.map((b) => renderBookingBar(b))}
          </div>
        </div>
      </div>

      <div className="form" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={selectedBookingId ? handleUpdate : handleAdd}>
          <div className="formRow">
            <div className="formItem">
              <label>Date: </label>
              <input type="date" min={getYyyyMmDdLocal(new Date())} name="date" value={inputs.date || ""} onChange={handleChange} required />
            </div>
            <div className="formItem">
              <label>Start time: </label>
              <input type="time" name="startTime" value={inputs.startTime || ""} onChange={handleChange} required />
            </div>
            <div className="formItem">
              <label>Duration: </label>
              <input type="number" name="duration" value={inputs.duration || ""} onChange={handleChange} min="60" step="30" placeholder="Duration (minutes)" required />
            </div>
          </div>

          <div className="formRow">
            <div className="formItem">
              <label>Table #: </label>
              <input type="number" name="tableNumber" value={inputs.tableNumber || ""} onChange={handleChange} min="1" max={tables.length || 1} required />
            </div>
            <div className="formItem">
              <label>Players: </label>
              <input type="number" name="players" value={inputs.players || ""} onChange={handleChange} />
            </div>
            <div className="formItem">
              <label>Game: </label>
              <input name="game" value={inputs.game || ""} onChange={handleChange} />
            </div>
          </div>

          <div className="formRow">
            <div className="formItem">
              <label>Contact name: </label>
              <input name="contactName" value={inputs.contactName || "Walk in"} onChange={handleChange} />
            </div>
            <div className="formItem">
              <label>Contact phone: </label>
              <input name="contactPhone" value={inputs.contactPhone || "+358505662613"} onChange={handleChange} />
            </div>
          </div>

          <div className="actions">
            <button type="submit" className="primary">{selectedBookingId ? "Update booking" : "Add booking"}</button>
            {selectedBookingId && (
              <>
                <button type="button" onClick={() => handleDelete(selectedBookingId)} className="danger">Delete</button>
                <button type="button" onClick={() => setSelectedBookingId(null)}>Clear selection</button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
