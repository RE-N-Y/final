import React, { Component } from 'react';
import { View, Text, Image, ActivityIndicator, TouchableOpacity, AsyncStorage } from 'react-native';
import { SQLite, FileSystem } from 'expo';
import { Loading } from './../common';
import { connect } from 'react-redux';
import { download, back } from './../actions';

class Download extends Component {

	constructor() {
		super();

		this.state = {
			error: false,
			downloadProgress: 0
		}
	}

	async loadDB() {
		await this.makeSQLiteDirAsync();

		const callback = downloadProgress => {
		  const progress =
		    downloadProgress.totalBytesWritten /
		    downloadProgress.totalBytesExpectedToWrite;
		  this.setState({
		    downloadProgress: progress,
		  });
		};

		const downloadResumable = FileSystem.createDownloadResumable(
		  'https://github.com/RE-N-Y/final/blob/master/db.db?raw=true',
		  FileSystem.documentDirectory + 'SQLite/anime.db',
		  {},
		  callback
		);

		try {
		  const { uri } = await downloadResumable.downloadAsync();
		  console.log('Finished downloading to ', uri);
		} catch (e) {
		  this.handleDownloadError();
		};

		const message = await FileSystem.getInfoAsync(FileSystem.documentDirectory+'SQLite/anime.db');
		const db = await SQLite.openDatabase('anime.db');

		db.transaction(tx => {
	        tx.executeSql(
	          'select * from Q limit 0,1',
	          [],
	          (_, { rows }) => {
	            //console.log(JSON.stringify(rows));
	          }
	        );
      	},  ()=>{this.handleDownloadError()},
      		()=>{this.props.download('downloaded');
      	});
  	}

  	handleDownloadError() {
  		this.setState({error:true});
  		alert("Your network is currently disconnected or have a poor connection. Please, restart the app once you acquire a secure connection.");
  	}

	async makeSQLiteDirAsync() {
	  	const dbTest = SQLite.openDatabase('key.db');
	    await dbTest.transaction(tx => tx.executeSql(''));
	}

	async componentWillMount() {
		await this.loadDB();
	}

	render() {
		if(this.state.error) {
			return(
				<View style={[styles.viewStyle,{backgroundColor:'#F4F6F4'}]}>
					<Image style={{width:400,height:230}} source={require('./../../assets/error.gif')}/>
					<Text style={[styles.textStyle,{color:'#333'}]}>ERROR Code: Endless Eight</Text>
				</View>
			);
		} else {
			return(
				<View style={styles.viewStyle}>
					<View style={styles.viewStyle}/>
					{this.props.downloaded === 'downloaded' ? 
						<View style={styles.downloadContainerStyle}>
							<TouchableOpacity onPress={()=>{this.props.back();this.props.download('complete');}} style={styles.viewStyle}>
								<Image style={styles.iconStyle} source={require('./../../assets/icons/correct.png')}/>
								<Text style={styles.textStyle}>COMPLETE!</Text>
								<Text style={styles.textStyle}>Press to Continue</Text>
							</TouchableOpacity>
							<View style={styles.viewStyle}/>
						</View>
						:
						<View style={styles.downloadContainerStyle}>
							<View style={styles.viewStyle}>
								<ActivityIndicator size="large"/>
								<Text style={styles.progressStyle}>{Math.round(this.state.downloadProgress*100)}%</Text>
							</View>
							<View style={{flex:1, justifyContent:'flex-end'}}>
								<Loading/>
							</View>
						</View>
					}
				</View>
			);
		}	
	}
}

const styles = {
	viewStyle: {
		flex:1,
		alignItems:'center',
		justifyContent:'center'
	},
	downloadContainerStyle: {
		flex: 2
	},
	iconStyle: {
		height: 50,
		width: 50
	},
	textStyle: {
		fontFamily: 'Avenir-Light',
		fontSize: 20,
		color:'#fff',
		marginTop:5
	},
	progressStyle: {
		fontFamily: 'Avenir-Light',
		fontSize: 15,
		color:'#000',
		opacity: 0.5
	}
}

const mapStateToProps = (state) => {
	return { downloaded: state.main.downloaded }
}

export default connect(mapStateToProps,{download,back})(Download);