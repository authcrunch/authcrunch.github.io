import assert from 'node:assert/strict';
import {test} from 'node:test';
import {runInNewContext} from 'node:vm';
import {DISMISSED_ATTRIBUTE, DISMISSAL_MS, STORAGE_KEY, bannerBootstrapScript, dismissalRemaining} from '../../../src/components/CommunityBanner/dismissal.mjs';

const now = Date.UTC(2026, 9, 26, 12);
test('a dismissal lasts seven days from the click, without extending on reads', () => {
  const value = String(now);
  assert.equal(dismissalRemaining(value, now), DISMISSAL_MS);
  assert.equal(dismissalRemaining(value, now + DISMISSAL_MS - 1), 1);
  assert.equal(dismissalRemaining(value, now + DISMISSAL_MS), 0);
  assert.equal(dismissalRemaining(value, now + DISMISSAL_MS + 1), 0);
});
test('missing, malformed, and future timestamps leave the announcement visible', () => {
  for (const value of [null, '', 'bad', 'NaN', 'Infinity', '-1', '0', String(now + 1)]) assert.equal(dismissalRemaining(value, now), 0, value);
});
test('the first-paint script uses the same expiry policy and tolerates blocked storage', () => {
  for (const [value, expected] of [[String(now), 'true'], [String(now - DISMISSAL_MS), 'false'], ['bad', 'false'], [String(now + 1), 'false']]) {
    const attributes = {};
    runInNewContext(bannerBootstrapScript(), {
      Date: {now: () => now},
      localStorage: {getItem(key) {assert.equal(key, STORAGE_KEY); return value;}},
      document: {documentElement: {setAttribute: (key, value) => {attributes[key] = value;}}},
    });
    assert.equal(attributes[DISMISSED_ATTRIBUTE], expected);
  }
  assert.doesNotThrow(() => runInNewContext(bannerBootstrapScript(), {
    localStorage: {getItem() {throw new Error('Storage disabled');}},
  }));
});
