/*
 * import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
 * import { Server, Socket } from 'socket.io';
 * import { AuthService } from '@/modules/auth/auth.service';
 */

/*
 * @WebSocketGateway({ cors: true })
 * export class WebSocketService implements OnGatewayConnection {
 *   @WebSocketServer()
 *   server: Server;
 */

/*
 *   constructor(private readonly authService: AuthService) {
 *   }
 */

/*
 *   async handleConnection(client: Socket) {
 *     try {
 *       const token = client.request.headers.authorization?.split(' ')[1];
 */

/*
 *       if (!token) {
 *         client.disconnect(true);
 */

/*
 *         return;
 *       }
 */

//       const user = await this.authService.validateAccessToken(token);

/*
 *       if (!user) {
 *         client.disconnect(true);
 */

/*
 *         return;
 *       }
 */

//       const userId = user.id;

/*
 *       client.join(userId);
 *     } catch (err) {
 *       console.error('[WebSocket] Connection Error:', err);
 */

/*
 *       client.disconnect(true);
 *     }
 *   }
 */

/*
 *   async emitToUser<T>(userId: string, event: string, payload: T) {
 *     this.server.to(userId).emit(event, payload);
 *   }
 * }
 */
