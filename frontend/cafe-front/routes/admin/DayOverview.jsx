import React, { useState, useEffect } from 'react';
import { DayPilotCalendar } from "@daypilot/daypilot-lite-react";

const DayOverview = () => {
    // State for viewType
    const [config, setConfig] = useState({
        viewType: "Resources",
        columns: [
            { name: "Room 1", id: "R1" },
            { name: "Room 2", id: "R2" },
            { name: "Room 3", id: "R3" },
            { name: "Room 4", id: "R4" },
            { name: "Room 5", id: "R5" },
            { name: "Room 6", id: "R6" },
            { name: "Room 7", id: "R7" },
        ]
    });

    // State for startDate
    const [startDate, setStartDate] = useState(new Date().toJSON().slice(0, 10));
    const [columns, setColumns] = useState([]);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        setColumns([
            { name: "Room 1", id: "R1" },
            { name: "Room 2", id: "R2" },
            { name: "Room 3", id: "R3" },
            { name: "Room 4", id: "R4" },
            { name: "Room 5", id: "R5" },
            { name: "Room 6", id: "R6" },
            { name: "Room 7", id: "R7" },
        ]);
    }, []);

    useEffect(() => {
        setBookings([
            {
                id: 1,
                text: "Event 1",
                start: "2025-06-02T11:00:00",
                end: "2025-06-02T13:30:00",
                barColor: "#fcb711",
                resource: "R1"
            },
            {
                id: 2,
                text: "Event 2",
                start: "2025-06-02T10:00:00",
                end: "2025-06-02T12:00:00",
                barColor: "#f37021",
                resource: "R2"
            },
            // ...
        ]);
    }, []);

    return (
        <DayPilotCalendar
            viewType={"Resources"}
            {...config}
            startDate={startDate}
            columns={columns}
            events={bookings}
        />
    );
}

export default DayOverview;




    const createTimeline = () => {
        const days = DayPilot.Date.today().daysInMonth();
        const start = DayPilot.Date.today().firstDayOfMonth();

        const result = [];
        for (let i = 0; i < days; i++) {
            const day = start.addDays(i);
            result.push({
                start: day.addHours(9),
                end: day.addHours(18)
            });
        }
        return result;
    }

    const [config, setConfig] = useState({
        timeline: createTimeline(),
        scale: "Manual",
        timeHeaders: [
            { groupBy: "Month" },
            { groupBy: "Day", format: "d" },
        ],
    });
    return (
        <DayPilotScheduler 
           {...config}
        />
    );

