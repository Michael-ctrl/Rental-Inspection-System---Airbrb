package com.ris.rentalinspectionsystem.model;

public enum Topic {
    SCHEDULE_INSPECTION,
    RENTAL_RATE,
    OTHER;

    public static Topic fromString(String s) {
        for (Topic topic : Topic.values()) {
            if (topic.name().equalsIgnoreCase(s)) {
                return topic;
            }
        }
        return null;
    }
}