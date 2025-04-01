import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { URL } from 'url';
enum CircuitBreakerStates {
  OPEN,
  HALF_OPEN,
  CLOSED,
}

class CircuitBreaker {
  private failureThreshold: number;
  private successThreshold: number;
  private failureCount: number;
  private successCount: number;
  private timeout: number;
  private state: CircuitBreakerStates;
  private nextAttempt: number;

  constructor(
    failureThreshold: number = 5,
    successThreshold: number = 2,
    timeout: number = 5000,
  ) {
    this.failureThreshold = failureThreshold;
    this.successThreshold = successThreshold;
    this.failureCount = 0;
    this.successCount = 0;
    this.timeout = timeout;
    this.state = CircuitBreakerStates.CLOSED;
    this.nextAttempt = Date.now();
  }

  isOpen(): boolean {
    return this.state === CircuitBreakerStates.OPEN;
  }

  isHalfOpen(): boolean {
    return this.state === CircuitBreakerStates.HALF_OPEN;
  }

  isClosed(): boolean {
    return this.state === CircuitBreakerStates.CLOSED;
  }

  open(): void {
    this.state = CircuitBreakerStates.OPEN;
    this.nextAttempt = Date.now() + this.timeout;

    console.table({
      circuitBreaker: 'open',
      nextAttempt: new Date(this.nextAttempt).toISOString(),
      failureCount: this.failureCount,
    });
  }

  halfOpen(): void {
    this.state = CircuitBreakerStates.HALF_OPEN;

    console.table({
      circuitBreaker: 'half open',
      successCount: this.successCount,
    });
  }

  close(): void {
    this.successCount = 0;
    this.state = CircuitBreakerStates.CLOSED;

    console.table({
      circuitBreaker: 'closed',
      failureCount: this.failureCount,
    });
  }

  async send(request: AxiosRequestConfig): Promise<AxiosResponse> {
    if (this.isOpen()) {
      if (this.nextAttempt <= Date.now()) {
        this.halfOpen();
      } else {
        this.logHost(request);
        throw new Error('Internal server error');
      }
    }
    try {
      const response = await axios({
        ...request,
        timeout: this.timeout,
      });
      
      return this.success(response);
    } catch (err: any) {
      return this.failure(err);
    }
  }

  private success(res: AxiosResponse): any {
    this.failureCount = 0;
    if (this.isHalfOpen()) {
      this.successCount++;
      if (this.successCount > this.successThreshold) {
        this.close();
      }
    }
    return { status: res.status, data: res.data };
  }

  private failure(err: any): Promise<any> {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.open();
    }
    return Promise.reject(err);
  }

  private logHost(request: AxiosRequestConfig): void {
    if (request?.url) {
      const url = new URL(request.url);
    }
  }
}

export default CircuitBreaker;
