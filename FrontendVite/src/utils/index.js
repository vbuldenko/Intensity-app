export function isTomorrow(currentDate, dateToCheck) {
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);
    return (
        tomorrow.getDate() === dateToCheck.getDate() &&
        tomorrow.getMonth() === dateToCheck.getMonth() &&
        tomorrow.getFullYear() === dateToCheck.getFullYear()
    );
}

// Function to check if a client can reserve a place
export default function reservationAccess(
    currentDateTime,
    scheduledTime,
    reservedPlaces,
    hoursDiff
) {
    const currentHour = currentDateTime.getHours();

    // Rule 1: If scheduled time has passed, reservation is closed
    if (currentDateTime >= scheduledTime) {
        return false;
    }

    // Rule 2: Client cannot reserve next day trainings scheduled at 9 a.m, 10 a.m, and 11 a.m after 9 p.m of the current day
    if (
        isTomorrow(currentDateTime, scheduledTime) &&
        [9, 10, 11].includes(scheduledTime.getHours()) &&
        currentHour >= 21 &&
        reservedPlaces <= 1
    ) {
        return false;
    }

    // Rule 3: Client cannot reserve less than 3 hours before scheduled training
    if (hoursDiff <= 3) {
        if (reservedPlaces < 2) {
            return false; // Not allowed to reserve less than 3 hours before if there are less than two places reserved
        }
    }

    if (
        currentDateTime.getDate() === scheduledTime.getDate() &&
        currentHour < 8 &&
        [9, 10, 11].includes(scheduledTime.getHours()) &&
        reservedPlaces <= 1
    ) {
        return false; // Not allowed to reserve morning trainings if there are less than two places reserved
    }

    // If none of the above conditions are met, reservation is allowed
    return true;
}

export function findMostRecentAbonement(abonements) {
    // if user has no abonements
    if (abonements.length === 0) {
        return null;
    }

    const mostRecentAbonement = abonements.reduce((mostRecent, abonement) => {
        const currentDate = new Date(abonement.purchase_date);
        const currentMaxDate = mostRecent
            ? new Date(mostRecent.purchase_date)
            : null;

        if (!currentMaxDate || currentDate > currentMaxDate) {
            return abonement;
        } else {
            return mostRecent;
        }
    }, null);

    return mostRecentAbonement;
}
