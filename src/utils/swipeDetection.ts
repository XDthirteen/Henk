/*#####################################
/
/ # swipeDetection.ts
/ # ==================
/ # Description:
/ # ------------
/ # Detect wich way is swiped in a HTML element, and execute a function per direction
/
/ # Author: Jorn Vierbergen
/ # Creation date: 20/03/2025
/
#################
/
/ Changelog:
/ ----------
/ 21/03/2025 - Jorn Vierbergen
/ - Added preventDefault() on swipe
/ - Added usage in comment at the bottom
/ - Changed services/swipeDetection.service.ts to utils/swipeDetection.ts
/
/ To do:
/
/ Comments:
/ ------------
/ None
/
#####################################*/

import { ref } from 'vue'

export function swipe(swipeDistance = 50) {
	const startX = ref(0);
	const startY = ref(0);
	const endX = ref(0);
	const endY = ref(0);

	const onTouchStart = (event: TouchEvent) => {
		startX.value = event.touches[0].clientX;
		startY.value = event.touches[0].clientY;
	};

	const onTouchEnd = (event: TouchEvent) => {
		endX.value = event.changedTouches[0].clientX;
		endY.value = event.changedTouches[0].clientY;

		const direction = swipeDirection();
		if (direction) event.preventDefault(); // down refreshes browser often
		return direction;
	};

	const swipeDirection = (): string | null => {
		const horizontal = Math.abs(startX.value - endX.value);
		const vertical = Math.abs(startY.value - endY.value);

		if (horizontal >= swipeDistance || vertical >= swipeDistance) {
			if (horizontal > vertical) {
				return startX.value - endX.value > 0 ? 'left' : 'right';
			}
      else {
				return startY.value - endY.value > 0 ? 'up' : 'down';
			};
		};
		return null;
	};

	return { onTouchStart, onTouchEnd };
};
/*
Usage swipe detection

Can be used in all HTML tags

<script setup lang="ts">
import { swipe } from '@/utils/swipeDetection';
const { onTouchStart, onTouchEnd } = swipe();
</script>

<template>
	<div class="className"
			@touchstart="onTouchStart"
			@touchend="(event) => {
				const direction = onTouchEnd(event);
				if (direction === 'right') foo();
				if (direction === 'left') foo();
				if (direction === 'up') foo();
				if (direction === 'down') foo();
				if (direction === null) foo(); // swiped less then 50 pixels (touch/click is also less then 50px)
			}"
	>
	</div>
</template>
*/