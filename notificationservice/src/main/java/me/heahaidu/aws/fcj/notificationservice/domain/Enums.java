package me.heahaidu.aws.fcj.notificationservice.domain;

public final class Enums {
    private Enums() {}

    public enum Priority { LOW, NORMAL, HIGH, URGENT }
    public enum Channel { PUSH, EMAIL, SMS }
    public enum JobStatus { PENDING, PROCESSING, SENT, FAILED, DEAD }

    public static short priorityToCode(Priority p) {
        return (short) switch (p) {
            case LOW -> 0;
            case NORMAL -> 1;
            case HIGH -> 2;
            case URGENT -> 3;
        };
    }
}