import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { doc, updateDoc, arrayUnion, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

export async function saveGameResult(gameId, gameName, score, result) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    const gameEntry = {
      gameId,
      gameName,
      score: score || 0,
      result, // 'win' / 'lose' / 'gameover' / 'complete'
      playedAt: new Date().toISOString()
    };

    try {
      await updateDoc(doc(db, "users", user.uid), {
        gamesPlayed: arrayUnion(gameEntry)
      });

      // Update level based on games played
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data();
        const games = data.gamesPlayed || [];
        const wins = games.filter(g => g.result === 'win' || g.result === 'complete').length;
        const total = games.length;
        const winRate = total > 0 ? wins / total : 0;

        let newLevel = data.level;
        if (total >= 4 && winRate >= 0.6) newLevel = 'Expert';
        else if (total >= 2 && winRate >= 0.4) newLevel = 'Intermediate';

        if (newLevel !== data.level) {
          await updateDoc(doc(db, "users", user.uid), { level: newLevel });
          console.log(`Level updated to ${newLevel}!`);
        }
      }
    } catch (err) {
      console.error('Failed to save game:', err);
    }
  });
}