import * as utils from '@noble/curves/abstract/utils';
import { hmac } from '@noble/hashes/hmac';
import { sha256 } from '@noble/hashes/sha256';
import { base64 } from '@scure/base';

const IMGPROXY_URL = 'https://imgproxy.yabu.me/';
const IMGPROXY_KEY =
  'd3b13dda739ee62c0a36c5fbb5bcbb550fd777c1d58329f54b41a2fc85c0e1f23d65bb343af97508c7b5f512726d86680489732a8646570ddd02a0cc4d9dc1ef';
const IMGPROXY_SALT =
  '50c4f5a722f57fc34a8d453cfdd0c687e9779a0ae5ba047578967c9a69ca1e9b1b2595bd2b78237dec19bb5db33dea5f134ead1e79edb7dbe995e6c0dcfbf0a0';

const hmacSha256 = (key: Uint8Array, ...messages: Uint8Array[]) =>
  hmac(sha256, key, utils.concatBytes(...messages));

export const createImgProxyUrl = (srcUrl: string | undefined, resize?: number): string => {
  if (typeof srcUrl === 'undefined') return '';

  const textEncoder = new TextEncoder();

  function urlSafe(s: string) {
    return s.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }

  function signUrl(u: string) {
    const result = hmacSha256(
      utils.hexToBytes(IMGPROXY_KEY),
      utils.hexToBytes(IMGPROXY_SALT),
      textEncoder.encode(u),
    );
    return urlSafe(base64.encode(result));
  }

  if (srcUrl.startsWith('data:') || srcUrl.startsWith('blob:')) return srcUrl;
  const opt = resize
    ? `rs:fit:${resize}:${resize}/dpr:${window.devicePixelRatio}`
    : `rs:fit:1000:1000/dpr:${window.devicePixelRatio}`;
  const urlBytes = textEncoder.encode(srcUrl);
  const urlEncoded = urlSafe(base64.encode(urlBytes));
  const path = `/${opt}/${urlEncoded}`;
  const sig = signUrl(path);
  return `${new URL(IMGPROXY_URL).toString()}${sig}${path}`;
};

export default createImgProxyUrl;
