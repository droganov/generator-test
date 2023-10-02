'use client'
import { Button, Mic } from '@yobta/ui'
import type { FunctionComponent } from 'react'
import { useEffect } from 'react'

import { addExpense } from '../../generated/api'
import { useAudioRecorder } from '../hooks/useAudioRecorder'
import { addExpenses } from '../components/Expenses/ExpensesStore'
import { ExpenceCategories } from '../components/Expenses/ExpenceCategories'
import { ExpenceList } from '../components/Expenses/ExpenceList'
const maxLengthInSeconds = 30

export const Audio: FunctionComponent = () => {
  const { audio, audioUrl, secondsRemaining, startRecording, stopRecording } =
    useAudioRecorder({
      maxLengthInSeconds,
    })
  useEffect(() => {
    if (audio) {
      addExpense({
        formData: { audio },
      }).then(addExpenses)
    }
  }, [audio])
  return (
    <>
      {secondsRemaining} / {maxLengthInSeconds}
      <ExpenceCategories />
      <ExpenceList />
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
