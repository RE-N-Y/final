import React from 'react';
import StartScreen from './screens/StartScreen';
import QuizScreen from './screens/QuizScreen';
import AchievementScreen from './screens/AchievementScreen';
import StatusScreen from './screens/StatusScreen';
import SelectScreen from './screens/SelectScreen';
import DeckScreen from './screens/DeckScreen';
import LightBoxScreen from './screens/LightBoxScreen';
import TutorialScreen from './screens/TutorialScreen';
import { StackNavigator, TabNavigator } from 'react-navigation';

//no header for stack navigator
const stackNavigatorOption = {
	headerMode: 'none'
};

//config for tabNavigation
const tabNavigatorOption = {
	animationEnabled: true,
	swipeEnabled: false,
	tabBarPosition: 'bottom',
	tabBarOptions: {
		activeTintColor: '#4B4097',
		inactiveTintColor: 'rgba(0, 0, 0, 0.3)',
		showLabel: false,
		showIcon: true,
		indicatorStyle: {
			backgroundColor: '#4B4097'
		},
		style: {
			backgroundColor: '#fff',
			height: 50,
		}
	}
};

/**
	-----Router structure------
	-Router/
		-Start
		-Tutorial
		-Main/
			-Status
			-Achievement
			-Pack/
				-Deck
				-Mode/
					-Select
					-Quiz/
						-Quiz
						-Lightbox
	------Router structure------
**/
const Quiz = StackNavigator({
	quiz: { screen: QuizScreen },
	lightbox: { screen: LightBoxScreen }
},stackNavigatorOption);

const Mode = StackNavigator({
	select: { screen: SelectScreen },
	quiz: { screen: Quiz }
},stackNavigatorOption);

const Pack = StackNavigator({
	deck: { screen: DeckScreen },
	mode: { screen: Mode }
},stackNavigatorOption);

const Router = StackNavigator({
	start: { screen: StartScreen },
	tutorial: { screen: TutorialScreen },
	main: {
		screen: TabNavigator({
			status: { screen: StatusScreen },
			pack: { screen: Pack }
		},tabNavigatorOption)
	}
},stackNavigatorOption);

//start->pack->mode->quiz

//export Router
export { Router };