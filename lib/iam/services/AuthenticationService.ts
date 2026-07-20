import * as argon2 from "argon2";
import { IUserRepository } from "../repositories/IUserRepository";
import { IRoleRepository } from "../repositories/IRoleRepository";
import { IIamEventBus } from "../events/IamEventBus";
import { SessionService } from "../sessions/SessionService";
import { AuthenticationError } from "../errors/IamErrors";
import { AccessToken, RefreshToken, User } from "../core/types";
import { TokenService } from "../tokens/TokenService";

interface LoginResult {
  accessToken: AccessToken;
  refreshToken: RefreshToken;
  user: Omit<User, "passwordHash">;
}

export class AuthenticationService {
  constructor(
    private userRepo: IUserRepository,
    private roleRepo: IRoleRepository,
    private sessionService: SessionService,
    private eventBus: IIamEventBus
  ) {}

  async login(email: string, plainPassword: string, ip: string, device: string, browser: string): Promise<LoginResult> {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      this.eventBus.publish({
        eventId: crypto.randomUUID(),
        eventType: "LoginFailed",
        timestamp: new Date().toISOString(),
        metadata: { email, ip, device, reason: "User not found" }
      });
      throw new AuthenticationError("Invalid email or password");
    }

    if (user.isLocked || !user.isActive) {
      this.eventBus.publish({
        eventId: crypto.randomUUID(),
        eventType: "LoginFailed",
        timestamp: new Date().toISOString(),
        userId: user.id,
        metadata: { email, ip, device, reason: "Account locked or inactive" }
      });
      throw new AuthenticationError("Account is locked or inactive");
    }

    const isValidPassword = await argon2.verify(user.passwordHash, plainPassword);

    if (!isValidPassword) {
      user.failedLoginAttempts += 1;
      
      if (user.failedLoginAttempts >= 5) {
        user.isLocked = true;
        this.eventBus.publish({
          eventId: crypto.randomUUID(),
          eventType: "AccountLocked",
          timestamp: new Date().toISOString(),
          userId: user.id
        });
      }
      
      await this.userRepo.update(user);
      
      this.eventBus.publish({
        eventId: crypto.randomUUID(),
        eventType: "LoginFailed",
        timestamp: new Date().toISOString(),
        userId: user.id,
        metadata: { email, ip, device, reason: "Invalid password" }
      });
      
      throw new AuthenticationError("Invalid email or password");
    }

    // Reset failed attempts on success
    user.failedLoginAttempts = 0;
    user.lastLoginAt = new Date().toISOString();
    await this.userRepo.update(user);

    // Create secure session
    const session = await this.sessionService.createSession(user.id, device, browser, ip);
    
    // Generate Tokens
    const accessToken = await TokenService.generateAccessToken(user.id, user.roleId, session.id);
    const refreshToken = await TokenService.generateRefreshToken(user.id, session.id);

    this.eventBus.publish({
      eventId: crypto.randomUUID(),
      eventType: "UserLoggedIn",
      timestamp: new Date().toISOString(),
      userId: user.id,
      sessionId: session.id,
      metadata: { ip, device }
    });

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword
    };
  }

  async logout(userId: string, sessionId: string): Promise<void> {
    await this.sessionService.revokeSession(sessionId);
    
    this.eventBus.publish({
      eventId: crypto.randomUUID(),
      eventType: "UserLoggedOut",
      timestamp: new Date().toISOString(),
      userId,
      sessionId
    });
  }

  async hashPassword(plainPassword: string): Promise<string> {
    return argon2.hash(plainPassword);
  }
}
