import { PreviewJwtPayload } from "../core/types";

// In a real production system, this would be process.env.PREVIEW_SECRET.
// Using a mock secret for Phase 2.8.6 architecture demonstration.
const MOCK_JWT_SECRET = "ephemeral_preview_secret_2026";

export class PreviewService {
  /**
   * Generates a securely signed JWT payload.
   * Mocking the signing mechanism for architectural demonstration.
   */
  static generateSignedUrl(payload: Omit<PreviewJwtPayload, "exp" | "previewSessionId">, expiresInHours = 2): string {
    const previewSessionId = `ps_${Math.random().toString(36).substring(2, 9)}`;
    const exp = Date.now() + (expiresInHours * 60 * 60 * 1000);
    
    const completePayload: PreviewJwtPayload = {
      ...payload,
      previewSessionId,
      exp
    };

    // MOCK JWT SIGNING (base64 encoded JSON + mock signature)
    const encodedPayload = Buffer.from(JSON.stringify(completePayload)).toString("base64");
    const mockSignature = Buffer.from(MOCK_JWT_SECRET).toString("base64");
    
    const token = `${encodedPayload}.${mockSignature}`;
    return `/api/preview/enable?token=${token}`;
  }

  /**
   * Validates and decodes the JWT token.
   * Throws an error if invalid, tampered, or expired.
   */
  static validateToken(token: string): PreviewJwtPayload {
    try {
      const [encodedPayload, signature] = token.split(".");
      
      // MOCK VERIFICATION
      if (signature !== Buffer.from(MOCK_JWT_SECRET).toString("base64")) {
        throw new Error("Invalid signature");
      }

      const decodedString = Buffer.from(encodedPayload, "base64").toString("utf-8");
      const payload: PreviewJwtPayload = JSON.parse(decodedString);

      if (Date.now() > payload.exp) {
        throw new Error("Preview token expired");
      }

      return payload;
    } catch (e) {
      throw new Error("Failed to validate preview token: " + (e as Error).message);
    }
  }
}
