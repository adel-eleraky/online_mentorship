import moment from "moment";

function getNextScheduleTime(requestedTime) {
    const { day, time } = requestedTime;

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = moment();
    const todayIndex = today.day();
    const targetIndex = daysOfWeek.indexOf(day);

    if (targetIndex === -1) {
        throw new Error("Invalid day name provided");
    }

    let diff = (targetIndex - todayIndex + 7) % 7;
    if (diff === 0) diff = 7;

    const nextDate = today.clone().add(diff, "days").startOf("day");
    const scheduleTime = moment(
        `${nextDate.format("YYYY-MM-DD")} ${time}`,
        "YYYY-MM-DD h:mm A"
    );

    return scheduleTime.toISOString();
}

export default getNextScheduleTime;
