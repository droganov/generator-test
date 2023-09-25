'use client'
import { Button, Mic } from '@yobta/ui'
import type { FunctionComponent } from 'react'
import { useEffect } from 'react'

import { addExpense } from '../../generated/api/client/Default'
import { useAudioRecorder } from '../hooks/useAudioRecorder'
const maxLengthInSeconds = 10

export const Audio: FunctionComponent = () => {
  const { audio, audioUrl, secondsRemaining, startRecording, stopRecording } =
    useAudioRecorder({
      maxLengthInSeconds,
    })
  useEffect(() => {
    if (audio) {
      addExpense({
        formData: { audio },
      })
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
