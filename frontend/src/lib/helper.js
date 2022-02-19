// Helper functions

import { addMinutes, addSeconds } from "date-fns";
import jwtDecode from "jwt-decode";

// Capitalizes the first letter of string
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Returns the travel time from google maps directions API response
export function getTravelTimeFromRoute(directions) {
  if (!directions) return [];
  return directions.routes[0].legs;
}

export function getArriveAndDepatureTime(startTime, legs, propertiesToInspect) {
  if (propertiesToInspect.length !== legs.length) {
    return [];
  }
  const arriveDepartureTime = [];
  let currentTime = startTime;
  for (let i = 0; i < legs.length; i++) {
    const arriveAt = addSeconds(currentTime, legs[i].duration.value);
    const departAt = addMinutes(arriveAt, propertiesToInspect[i].duration);
    arriveDepartureTime.push({
      arriveAt,
      departAt,
    });
    currentTime = departAt;
  }
  return arriveDepartureTime;
}

export function hashString(str) {
  var hash = 0;
  if (str.length === 0) {
    return hash;
  }
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

export function getUserId(token) {
  if (!token) return -1;
  const user = jwtDecode(token);
  return user.id;
}
