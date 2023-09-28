'use client'
import { Button, Mic } from '@yobta/ui'
import type { FunctionComponent } from 'react'
import { useEffect } from 'react'

import { addExpense } from '../../generated/api/client/Default'
import { useAudioRecorder } from '../hooks/useAudioRecorder'
const maxLengthInSeconds = 10

// const addExpense = (audio: Blob): Promise<void> => {
//   return new Promise((resolve, reject) => {
//     const formData = new FormData()
//     formData.append('audio', audio)
//     fetch('http://localhost:8000/expense/add', {
//       method: 'POST',
//       body: formData,
//     })
//       .then((response) => {
//         if (response.ok) {
//           resolve()
//         } else {
//           reject()
//         }
//       })
//       .catch((error) => {
//         reject(error)
//       })
//   })
// }

export const Audio: FunctionComponent = () => {
  const { audio, audioUrl, secondsRemaining, startRecording, stopRecording } =
    useAudioRecorder({
      maxLengthInSeconds,
    })
  useEffect(() => {
    if (audio) {
      addExpense({ formData: { audio } })
    }
  }, [audio])
  return (
    <>
      {audioUrl && (
        <audio controls>
          <source src={audioUrl} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
      {secondsRemaining} / {maxLengthInSeconds}
      <Button
        className="yobta-primary p-0 w-24 h-24 rounded-full fixed bottom-8 left-1/2 -translate-x-1/2"
        onPointerDown={startRecording}
        onPointerUp={stopRecording}
      >
        <Mic className="w-10 h-10" />
      </Button>
    </>
  )
}
