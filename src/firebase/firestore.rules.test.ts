import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { setDoc, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';

let testEnv: RulesTestEnvironment;

const brandId = 'brand-user';
const creatorId = 'creator-user';
const anotherCreatorId = 'another-creator';
const intruderId = 'intruder';

describe('Firestore Security Rules', () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'vibematch-full-test',
      firestore: {
        rules: readFileSync('firestore.rules', 'utf8'),
        host: 'localhost',
        port: 8080,
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
    // Setup initial user roles
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const firestore = context.firestore();
      await setDoc(doc(firestore, `users/${brandId}`), { uid: brandId, role: 'brand' });
      await setDoc(doc(firestore, `users/${creatorId}`), { uid: creatorId, role: 'creator' });
      await setDoc(doc(firestore, `users/${anotherCreatorId}`), { uid: anotherCreatorId, role: 'creator' });
    });
  });
  
  describe('User Profile Rules', () => {
    it('should ALLOW a user to create their own profile', async () => {
      const newUser = 'new-user-id';
      const db = testEnv.authenticatedContext(newUser).firestore();
      await assertSucceeds(setDoc(doc(db, `users/${newUser}`), { uid: newUser, role: 'creator' }));
    });
    
    it('should DENY a user from creating a profile for someone else', async () => {
        const newUser = 'new-user-id';
        const db = testEnv.authenticatedContext(newUser).firestore();
        await assertFails(setDoc(doc(db, `users/another-user`), { uid: 'another-user', role: 'creator' }));
    });

    it('should ALLOW a user to update their own profile', async () => {
        const db = testEnv.authenticatedContext(creatorId).firestore();
        await assertSucceeds(updateDoc(doc(db, `users/${creatorId}`), { displayName: 'New Name' }));
    });
    
    it('should DENY a user from updating someone else\'s profile', async () => {
        const db = testEnv.authenticatedContext(intruderId).firestore();
        await assertFails(updateDoc(doc(db, `users/${creatorId}`), { displayName: 'Hacked' }));
    });
    
    it('should DENY a creator from updating admin-only fields on their profile', async () => {
        const db = testEnv.authenticatedContext(creatorId).firestore();
        await assertFails(updateDoc(doc(db, `users/${creatorId}`), { adminBadge: true }));
        await assertFails(updateDoc(doc(db, `users/${creatorId}`), { initialTrustScore: 100 }));
    });
  });

  describe('Campaign Rules', () => {
    const campaignId = 'campaign-123';
    
    beforeEach(async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
            const firestore = context.firestore();
            await setDoc(doc(firestore, `campaigns/${campaignId}`), { brandId: brandId, title: 'Test Campaign' });
        });
    });

    it('should ALLOW a brand to create a campaign with their own brandId', async () => {
      const db = testEnv.authenticatedContext(brandId).firestore();
      await assertSucceeds(setDoc(doc(db, 'campaigns/new-campaign'), { brandId: brandId, title: 'Brand New Campaign' }));
    });

    it('should DENY a creator from creating a campaign', async () => {
      const db = testEnv.authenticatedContext(creatorId).firestore();
      await assertFails(setDoc(doc(db, 'campaigns/creator-campaign'), { brandId: creatorId, title: 'Creator Campaign' }));
    });
    
    it('should ALLOW a creator to read any campaign', async () => {
        const db = testEnv.authenticatedContext(creatorId).firestore();
        await assertSucceeds(getDoc(doc(db, `campaigns/${campaignId}`)));
    });
    
    it('should ALLOW a brand to read their OWN campaign', async () => {
        const db = testEnv.authenticatedContext(brandId).firestore();
        await assertSucceeds(getDoc(doc(db, `campaigns/${campaignId}`)));
    });

    it('should DENY a brand from reading another brand\'s campaign', async () => {
        const otherBrandId = 'other-brand';
        const db = testEnv.authenticatedContext(otherBrandId).firestore();
        await assertFails(getDoc(doc(db, `campaigns/${campaignId}`)));
    });

    it('should ALLOW a brand to delete their own campaign', async () => {
        const db = testEnv.authenticatedContext(brandId).firestore();
        await assertSucceeds(deleteDoc(doc(db, `campaigns/${campaignId}`)));
    });

    it('should DENY a creator from deleting a campaign', async () => {
        const db = testEnv.authenticatedContext(creatorId).firestore();
        await assertFails(deleteDoc(doc(db, `campaigns/${campaignId}`)));
    });
  });

  describe('Campaign Application Rules', () => {
    const campaignId = 'application-campaign';
    const applicationId = 'app-123';

    beforeEach(async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
            const firestore = context.firestore();
            await setDoc(doc(firestore, `campaigns/${campaignId}`), { brandId: brandId });
            await setDoc(doc(firestore, `campaigns/${campaignId}/applications/${applicationId}`), { creatorId: creatorId });
        });
    });

    it('should ALLOW a creator to create an application for themselves', async () => {
        const db = testEnv.authenticatedContext(anotherCreatorId).firestore();
        await assertSucceeds(setDoc(doc(db, `campaigns/${campaignId}/applications/new-app`), { creatorId: anotherCreatorId }));
    });

    it('should DENY a creator from creating an application for someone else', async () => {
        const db = testEnv.authenticatedContext(creatorId).firestore();
        await assertFails(setDoc(doc(db, `campaigns/${campaignId}/applications/fraud-app`), { creatorId: intruderId }));
    });
    
    it('should ALLOW the brand owner to read an application', async () => {
        const db = testEnv.authenticatedContext(brandId).firestore();
        await assertSucceeds(getDoc(doc(db, `campaigns/${campaignId}/applications/${applicationId}`)));
    });
    
    it('should ALLOW the creator who applied to read their application', async () => {
        const db = testEnv.authenticatedContext(creatorId).firestore();
        await assertSucceeds(getDoc(doc(db, `campaigns/${campaignId}/applications/${applicationId}`)));
    });

    it('should DENY another creator from reading an application', async () => {
        const db = testEnv.authenticatedContext(anotherCreatorId).firestore();
        await assertFails(getDoc(doc(db, `campaigns/${campaignId}/applications/${applicationId}`)));
    });
    
    it('should ALLOW the creator to delete their own application', async () => {
        const db = testEnv.authenticatedContext(creatorId).firestore();
        await assertSucceeds(deleteDoc(doc(db, `campaigns/${campaignId}/applications/${applicationId}`)));
    });
  });

  describe('Chat Message Rules', () => {
    const conversationId = 'conversation-123';

    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        await setDoc(doc(context.firestore(), `conversations/${conversationId}`), {
          brand_id: brandId,
          creator_id: creatorId,
        });
      });
    });

    it('should ALLOW a participant to send a secure message', async () => {
      const db = testEnv.authenticatedContext(brandId).firestore();
      await assertSucceeds(setDoc(doc(db, `conversations/${conversationId}/messages/msg1`), { sender_id: brandId, text: 'This is a perfectly safe message.' }));
    });

    it('should DENY sending a message containing an email address', async () => {
      const db = testEnv.authenticatedContext(creatorId).firestore();
      await assertFails(setDoc(doc(db, `conversations/${conversationId}/messages/msg2`), { sender_id: creatorId, text: 'Please contact me at test@example.com' }));
    });

    it('should DENY sending a message containing "whatsapp"', async () => {
      const db = testEnv.authenticatedContext(brandId).firestore();
      await assertFails(setDoc(doc(db, `conversations/${conversationId}/messages/msg3`), { sender_id: brandId, text: 'My whatsapp is 12345' }));
    });

    it('should DENY sending a message containing a Moroccan phone number', async () => {
        const db = testEnv.authenticatedContext(brandId).firestore();
        await assertFails(setDoc(doc(db, `conversations/${conversationId}/messages/msg4`), { sender_id: brandId, text: 'Call me on 0612345678' }));
    });

    it('should DENY a non-participant from sending a message', async () => {
      const db = testEnv.authenticatedContext(intruderId).firestore();
      await assertFails(setDoc(doc(db, `conversations/${conversationId}/messages/msg5`), { sender_id: intruderId, text: 'I am an intruder.' }));
    });
    
    it('should DENY any user from updating or deleting a message', async () => {
        const messageId = 'msg-to-delete';
        await testEnv.withSecurityRulesDisabled(async (context) => {
            await setDoc(doc(context.firestore(), `conversations/${conversationId}/messages/${messageId}`), { sender_id: creatorId, text: 'original' });
        });

        const brandDb = testEnv.authenticatedContext(brandId).firestore();
        const creatorDb = testEnv.authenticatedContext(creatorId).firestore();
        
        await assertFails(updateDoc(doc(brandDb, `conversations/${conversationId}/messages/${messageId}`), { text: 'edited' }));
        await assertFails(deleteDoc(doc(creatorDb, `conversations/${conversationId}/messages/${messageId}`)));
    });
  });
});
