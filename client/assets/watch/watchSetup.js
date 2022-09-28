var otw = new OTW("otw")
			otw.createNewWatch({
				imageFolder: "assets/watch/img",
				timePieceXCenter: 114.5,
				timePieceYCenter: 113.25,
				width: 228,
				height: 225.5,
				xScale: 100.8,
				yScale: 97.2,
				xSkew: 0,
				ySkew: 0,
				baseRotation: 0,
				lightSource: 0,
			})
			otw.defaultPositionDate = new Date(2006, 7, 28, 10, 10, 31)
			otw.addTimepieceUnderCyclop({
				fileName: "cyclop.png",
				cyclopXPos: 159,
				cyclopYPos: 87,
				timepieceXOffset: -20,
				timepieceYOffset: -4,
				zoomValue: 1.3,
			})
			otw.addDynamicContent({
				fileNameFormat: "num_[x].png",
				xPos: 165,
				yPos: 105,
				contentType: "monthdate",
				timezone: null,
			})
			otw.addRotatedContent({
				fileName: "hours_shadow.png",
				xCenter: 17,
				yCenter: 66,
				xOffset: 0,
				yOffset: 3,
				cycleType: "hours",
				cycleTime: 12,
			})
			otw.addRotatedContent({
				fileName: "hours_24_shadow.png",
				xCenter: 14,
				yCenter: 101,
				xOffset: 1,
				yOffset: 4,
				cycleType: "hours",
				cycleTime: 24,
			})
			// otw.addStaticContent({
			// 	fileName: "hours_bottom_center.png",
			// 	xPos: 210,
			// 	yPos: 101,
			// })
			// otw.addRotatedContent({
			// 	fileName: "hours_dark_thickness.png",
			// 	xCenter: 17,
			// 	yCenter: 133,
			// 	xOffset: 0,
			// 	yOffset: 2,
			// 	cycleType: "hours",
			// 	cycleTime: 12,
			// 	isOptional: true,
			// })
			otw.addRotatedContent({
				fileName: "hours.png",
				xCenter: 17,
				yCenter: 66,
				xOffset: 0,
				yOffset: 1,
				cycleType: "hours",
				cycleTime: 12,
				lightEffects: ["left_shade", "right_shade"],
			})
			otw.addRotatedContent({
				fileName: "minutes_shadow.png",
				xCenter: 14,
				yCenter: 97,
				xOffset: 2,
				yOffset: 5,
				cycleType: "minutes",
				cycleTime: 60,
			})
			// otw.addStaticContent({
			// 	fileName: "hours_24_bottom_center.png",
			// 	xPos: 217,
			// 	yPos: 207,
			// })
			otw.addRotatedContent({
				fileName: "hours_24_dark_thickness.png",
				xCenter: 14,
				yCenter: 101,
				xOffset: 0,
				yOffset: -1,
				cycleType: "hours",
				cycleTime: 24,
				isOptional: true,
			})
			otw.addRotatedContent({
				fileName: "hours_24.png",
				xCenter: 14,
				yCenter: 101,
				xOffset: 0,
				yOffset: -1,
				cycleType: "hours",
				cycleTime: 24,
				lightEffects: ["left_shade", "right_shade"],
			})
			otw.addRotatedContent({
				fileName: "seconds_shadow.png",
				xCenter: 16,
				yCenter: 106,
				xOffset: 0,
				yOffset: 6,
				cycleType: "seconds",
				cycleTime: 60,
			})
			// otw.addStaticContent({
			// 	fileName: "minutes_bottom_center.png",
			// 	xPos: 211,
			// 	yPos: 208,
			// })
			otw.addRotatedContent({
				fileName: "minutes_dark_thickness.png",
				xCenter: 14,
				yCenter: 97,
				xOffset: 0,
				yOffset: -1,
				cycleType: "minutes",
				cycleTime: 60,
				isOptional: true,
			})
			otw.addRotatedContent({
				fileName: "minutes.png",
				xCenter: 14,
				yCenter: 97,
				xOffset: 0,
				yOffset: -1,
				cycleType: "minutes",
				cycleTime: 60,
				lightEffects: ["left_shade", "right_shade"],
			})
			// otw.addRotatedContent({
			// 	fileName: "seconds_dark_thickness.png",
			// 	xCenter: 16,
			// 	yCenter: 214,
			// 	xOffset: 0,
			// 	yOffset: -5,
			// 	cycleType: "seconds",
			// 	cycleTime: 60,
			// 	isOptional: true,
			// })
			otw.addRotatedContent({
				fileName: "seconds.png",
				xCenter: 16,
				yCenter: 106,
				xOffset: 0,
				yOffset: -3,
				cycleType: "seconds",
				cycleTime: 60,
				// lightEffects: ["top_light", "bottom_light"],
			})
			otw.addStaticContent({
				fileName: "seconds_top_center.png",
				xPos: 109,
				yPos: 105,
			})
			otw.showAndRun({
				targetDivName: "timepieceHolder",
				startOption: "defaultTime",
			})
			window.onload = function () {
				//otw.spinToTimeWithTechElapsedTime(0)
			}
			
function playWatch() {
	otw.spinToTimeWithTechElapsedTime(0);
}