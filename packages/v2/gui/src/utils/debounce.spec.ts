import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { debounce } from './debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should delay function execution', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();

    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should only execute once when called multiple times within delay', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should pass correct arguments to the function', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc('test', 123, true);

    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledWith('test', 123, true);
  });

  it('should use arguments from the last call', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc('first');
    debouncedFunc('second');
    debouncedFunc('third');

    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith('third');
  });

  it('should reset timer on subsequent calls', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    vi.advanceTimersByTime(50);
    debouncedFunc();
    vi.advanceTimersByTime(50);

    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);

    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should call function immediately with leading option', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100, { leading: true });

    debouncedFunc('immediate');

    expect(func).toHaveBeenCalledTimes(1);
    expect(func).toHaveBeenCalledWith('immediate');

    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should not call function again after delay with leading option', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100, { leading: true });

    debouncedFunc('first');
    expect(func).toHaveBeenCalledTimes(1);

    debouncedFunc('second');
    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should cancel pending execution', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    debouncedFunc.cancel();

    vi.advanceTimersByTime(100);

    expect(func).not.toHaveBeenCalled();
  });

  it('should allow execution after cancellation', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    debouncedFunc.cancel();
    debouncedFunc();

    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledTimes(1);
  });

  it('should handle cancel when no timer is active', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    expect(() => debouncedFunc.cancel()).not.toThrow();
  });

  it('should handle multiple cancel calls', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    debouncedFunc.cancel();
    debouncedFunc.cancel();

    vi.advanceTimersByTime(100);

    expect(func).not.toHaveBeenCalled();
  });

  it('should work with different delay values', () => {
    const func = vi.fn();
    const debouncedFunc = debounce(func, 500);

    debouncedFunc();

    vi.advanceTimersByTime(400);
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
  });
});
