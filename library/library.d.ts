export interface IWASock {
   processMessage: (message: import("@adiwajshing/baileys/lib/Types").WAProto.IWebMessageInfo, chatUpdate: Partial<import("@adiwajshing/baileys/lib/Types").Chat>) => Promise<void>;
   sendMessageAck: ({ tag, attrs }: import("..").BinaryNode, extraAttrs: {
      [key: string]: string;
   }) => Promise<void>;
   sendRetryRequest: (node: import("..").BinaryNode) => Promise<void>;
   appPatch: (patchCreate: import("@adiwajshing/baileys/lib/Types").WAPatchCreate) => Promise<void>;
   sendPresenceUpdate: (type: import("@adiwajshing/baileys/lib/Types").WAPresence, toJid?: string) => Promise<void>;
   presenceSubscribe: (toJid: string) => Promise<void>;
   profilePictureUrl: (jid: string, type?: "image" | "preview", timeoutMs?: number) => Promise<string>;
   onWhatsApp: (...jids: string[]) => Promise<{
      exists: boolean;
      jid: string;
   }[]>;
   fetchBlocklist: () => Promise<string[]>;
   fetchStatus: (jid: string) => Promise<{
      status: string;
      setAt: Date;
   }>;
   updateProfilePicture: (jid: string, content: import("@adiwajshing/baileys/lib/Types").WAMediaUpload) => Promise<void>;
   updateBlockStatus: (jid: string, action: "block" | "unblock") => Promise<void>;
   getBusinessProfile: (jid: string) => Promise<void | import("@adiwajshing/baileys/lib/Types").WABusinessProfile>;
   resyncAppState: (collections: import("@adiwajshing/baileys/lib/Types").WAPatchName[]) => Promise<import("@adiwajshing/baileys/lib/Types").AppStateChunk>;
   chatModify: (mod: import("@adiwajshing/baileys/lib/Types").ChatModification, jid: string) => Promise<void>;
   resyncMainAppState: () => Promise<void>;
   assertSessions: (jids: string[], force: boolean) => Promise<boolean>;
   relayMessage: (jid: string, message: import("@adiwajshing/baileys/lib/Types").WAProto.IMessage, { messageId: msgId, participant, additionalAttributes, cachedGroupMetadata }: import("@adiwajshing/baileys/lib/Types").MessageRelayOptions) => Promise<string>;
   sendReceipt: (jid: string, participant: string, messageIds: string[], type: "read" | "read-self") => Promise<void>;
   sendReadReceipt: (jid: string, participant: string, messageIds: string[]) => Promise<void>;
   refreshMediaConn: (forceGet?: boolean) => Promise<import("@adiwajshing/baileys/lib/Types").MediaConnInfo>;
   waUploadToServer: import("@adiwajshing/baileys/lib/Types").WAMediaUploadFunction;
   fetchPrivacySettings: (force?: boolean) => Promise<{
      [_: string]: string;
   }>;
   sendMessage: (jid: string, content: import("@adiwajshing/baileys/lib/Types").AnyMessageContent, options?: import("@adiwajshing/baileys/lib/Types").MiscMessageGenerationOptions) => Promise<import("@adiwajshing/baileys/lib/Types").WAProto.WebMessageInfo>;
   groupMetadata: (jid: string) => Promise<import("@adiwajshing/baileys/lib/Types").GroupMetadata>;
   groupCreate: (subject: string, participants: string[]) => Promise<import("@adiwajshing/baileys/lib/Types").GroupMetadata>;
   groupLeave: (id: string) => Promise<void>;
   groupUpdateSubject: (jid: string, subject: string) => Promise<void>;
   groupParticipantsUpdate: (jid: string, participants: string[], action: import("@adiwajshing/baileys/lib/Types").ParticipantAction) => Promise<string[]>;
   groupUpdateDescription: (jid: string, description?: string) => Promise<void>;
   groupInviteCode: (jid: string) => Promise<string>;
   groupRevokeInvite: (jid: string) => Promise<string>;
   groupAcceptInvite: (code: string) => Promise<string>;
   groupToggleEphemeral: (jid: string, ephemeralExpiration: number) => Promise<void>;
   groupSettingUpdate: (jid: string, setting: "announcement" | "locked" | "not_announcement" | "unlocked") => Promise<void>;
   groupFetchAllParticipating: () => Promise<{
      [_: string]: import("@adiwajshing/baileys/lib/Types").GroupMetadata;
   }>;
   type: "md";
   ws: import("ws");
   ev: import("@adiwajshing/baileys/lib/Types").BaileysEventEmitter;
   authState: {
      creds: import("@adiwajshing/baileys/lib/Types").AuthenticationCreds;
      keys: import("@adiwajshing/baileys/lib/Types").SignalKeyStoreWithTransaction;
   };
   user: import("@adiwajshing/baileys/lib/Types").Contact;
   assertingPreKeys: (range: number, execute: (keys: {
      [_: number]: any;
   }) => Promise<void>) => Promise<void>;
   generateMessageTag: () => string;
   query: (node: import("..").BinaryNode, timeoutMs?: number) => Promise<import("..").BinaryNode>;
   waitForMessage: (msgId: string, timeoutMs?: number) => Promise<any>;
   waitForSocketOpen: () => Promise<void>;
   sendRawMessage: (data: Uint8Array | Buffer) => Promise<void>;
   sendNode: (node: import("..").BinaryNode) => Promise<void>;
   logout: () => Promise<void>;
   end: (error: Error) => void;
   waitForConnectionUpdate: (check: (u: Partial<import("@adiwajshing/baileys/lib/Types").ConnectionState>) => boolean, timeoutMs?: number) => Promise<void>;
}