import { ref } from 'vue'

export function swipe(swipeDistance = 50) {
	const startX = ref(0)
	const startY = ref(0)
	const endX = ref(0)
	const endY = ref(0)

	const onTouchStart = (event: TouchEvent) => {
		startX.value = event.touches[0].clientX
		startY.value = event.touches[0].clientY
	}

	const onTouchEnd = (event: TouchEvent) => {
		endX.value = event.changedTouches[0].clientX
		endY.value = event.changedTouches[0].clientY
		return swipeDirection()
	}

	const swipeDirection = (): string | null => {
		const horizontal = Math.abs(startX.value - endX.value)
		const vertical = Math.abs(startY.value - endY.value)

		if (horizontal >= swipeDistance || vertical >= swipeDistance) {
			if (horizontal > vertical) {
				return startX.value - endX.value > 0 ? 'left' : 'right'
			}
            else {
				return startY.value - endY.value > 0 ? 'up' : 'down'
			}
		}
		return null
	}

	return { onTouchStart, onTouchEnd }
}
