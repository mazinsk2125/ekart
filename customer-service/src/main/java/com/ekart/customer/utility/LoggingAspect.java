package com.ekart.customer.utility;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * AOP-based request/response logging for controllers and service
 * implementations. Logs method entry (with arguments), exit (with result)
 * and execution time.
 */
@Aspect
@Component
public class LoggingAspect {

    private static final Logger log = LoggerFactory.getLogger(LoggingAspect.class);

    @Pointcut("within(com.ekart.customer.controller..*) || within(com.ekart.customer.service..*)")
    public void applicationLayers() {
    }

    @Around("applicationLayers()")
    public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
        String signature = joinPoint.getSignature().toShortString();
        if (log.isDebugEnabled()) {
            log.debug("Enter: {} with args = {}", signature, Arrays.toString(joinPoint.getArgs()));
        }
        long start = System.currentTimeMillis();
        try {
            Object result = joinPoint.proceed();
            long elapsed = System.currentTimeMillis() - start;
            if (log.isDebugEnabled()) {
                log.debug("Exit: {} ({} ms) with result = {}", signature, elapsed, result);
            } else {
                log.info("{} executed in {} ms", signature, elapsed);
            }
            return result;
        } catch (Throwable ex) {
            log.error("Exception in {}: {}", signature, ex.getMessage());
            throw ex;
        }
    }
}
