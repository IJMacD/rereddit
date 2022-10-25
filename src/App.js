import React, { useState } from 'react';
import { useEffect } from 'react';
import './App.css';
import { DiffViewer } from './DiffViewer';

function App() {
  const [ inputValue, setInputValue ] = useState(() => window.location.hash.slice(1));

  const idMatch = /([a-z0-9]+)\/?$/.exec(inputValue);
  const id = idMatch?.[1] || null;

  const pushShift = usePushShift(id);

  const reddit = useReddit(pushShift?.full_link);

  const createdDate = reddit ? new Date(reddit.created_utc * 1000) : null;

  const editedDate = reddit ? new Date(reddit.edited * 1000) : null;

  const formatter = Intl.DateTimeFormat([], { dateStyle: "long", timeStyle: "long" });

  return (
    <div className="App">
      <input style={{fontSize:"3em"}} value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="https:// reddit comment link" />
      <div>
        <p>Original:</p>
        <div className="PreviewBox">{pushShift?.body}</div>
        { createdDate && <p className="DateLabel">{formatter.format(createdDate)}</p> }
        <p>Current:</p>
        <div className="PreviewBox">{reddit?.body}</div>
        { editedDate && <p className="DateLabel">{formatter.format(editedDate)}</p> }
        <p>Diff:</p>
        <DiffViewer left={pushShift?.body} right={reddit?.body} />
      </div>
    </div>
  );
}

export default App;

/**
 * @param {string?} id
 */
function usePushShift (id) {
  const [ data, setData ] = useState(/** @type {object?} */(null));

  useEffect(() => {
    if (id) {
      fetch(`https://api.pushshift.io/reddit/comment/search?ids=${id}`)
        .then(r => r.json())
        .then(d => d.data[0])
        .then(setData);
    }
    else {
      setData(null);
    }

  }, [id]);

  return data;
}

/**
 * @param {string?} url
 */
function useReddit (url) {
  const [ data, setData ] = useState(/** @type {object?} */(null));

  useEffect(() => {
    if (url) {
      const jsonUrl = `${url?.replace(/\/$/, "")}.json`;
      const path = new URL(url).pathname;

      fetch(jsonUrl)
        .then(r => r.json())
        .then(d => findComment(d, path))
        .then(setData);
    }
    else {
      setData(null);
    }

  }, [url]);

  return data;
}

function findComment (listingData, permalink) {
  // for (const listing of listingData) {

  // }
  return listingData[1].data.children[0].data;
}