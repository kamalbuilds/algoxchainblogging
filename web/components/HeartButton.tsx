
import { firestore, auth, increment, } from "../lib/firebase";
import { useDocument } from "react-firebase-hooks/firestore";


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const HeartButton = ({ postRef }) => {
  const heartRef = postRef.collection("hearts").doc(auth?.currentUser && auth.currentUser.uid);
  const [heartDoc] = useDocument(heartRef);

  const addHeart = async () => {
    const uid = auth?.currentUser && auth.currentUser.uid;
    const batch = firestore.batch();

    batch.update(postRef, { heartCount: increment(1) });
    batch.set(heartRef, { uid });

    await batch.commit();
  };

  const removeHeart = async () => {
    const batch = firestore.batch();

    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(heartRef);

    await batch.commit();
  };

  return (
    <div className="card">
      {heartDoc?.exists ? (
        <button onClick={removeHeart}>💔 Dislike</button>
      ) : (
        <button onClick={addHeart}>❤️ Love</button>
      )
      }
    </div>
  )
};
export default HeartButton;
