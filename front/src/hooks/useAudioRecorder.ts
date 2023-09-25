import { useCallback, useEffect, useRef, useState } from 'react'

type StartRecordingOptions = {
  maxLengthInSeconds?: number
}

interface AudioRecorderHook {
  (options?: StartRecordingOptions): {
    audio: Blob | null
    audioUrl: null | string
    errors: Error[]
    secondsRemaining: null | number
    startRecording: VoidFunction
    stopRecording: VoidFunction
  }
}

export const useAudioRecorder: AudioRecorderHook = ({
  maxLengthInSeconds,
} = {}) => {
  const [audio, setAudio] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<null | string>(null)
  const [errors, setErrors] = useState<Error[]>([])
  const [secondsRemaining, setSecondsRemaining] = useState<null | number>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  useEffect(() => {
    if (audio) {
      const url = URL.createObjectURL(audio)
      setAudioUrl(url)
      return () => {
        URL.revokeObjectURL(url)
        setAudioUrl(null)
      }
    }
    return undefined
  }, [audio])

  const startRecording = useCallback(() => {
    setSecondsRemaining(maxLengthInSeconds || null)
    const audioChunks: Blob[] = []
    let timer: NodeJS.Timeout | null = null

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream)

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunks.push(event.data)
        }

        mediaRecorderRef.current.start()

        mediaRecorderRef.current.onstop = () => {
          setAudio(new Blob(audioChunks, { type: 'audio/wav' }))
          if (timer) {
            clearTimeout(timer)
          }
        }

        if (maxLengthInSeconds) {
          timer = setInterval(() => {
            setSecondsRemaining((prev) => (prev !== null ? prev - 1 : null))
          }, 1000)

          setTimeout(() => {
            if (mediaRecorderRef.current) {
              mediaRecorderRef.current.stop()
            }
            if (timer) {
              clearTimeout(timer)
            }
          }, maxLengthInSeconds * 1000)
        }
      })
      .catch((err) => {
        setErrors((prevErrors) => [...prevErrors, err])
      })
  }, [maxLengthInSeconds])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
    }
    setSecondsRemaining(null)
  }, [])

  return {
    audio,
    audioUrl,
    errors,
    secondsRemaining,
    startRecording,
    stopRecording,
  }
}
