import React, { Component } from "react"
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { fetchUser } from "./redux/actions/index"
import { MaterialCommunityIcons } from 'react-native-vector-icons/'
import CourseScreen from './screens/CoursesScreen'


const Tab = createMaterialBottomTabNavigator()

export class Main extends Component {
  componentDidMount() {
    this.props.fetchUser()
  }
  render() {
    return (
      <Tab.Navigator initialRouteName="Course" labeled={false}>
        <Tab.Screen
          name="Course"
          component={CourseScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="school" color={color} size={26} />
            )
          }}
        />
      
      </Tab.Navigator>
    )
  }
}

const mapStateToProps = store => ({
  currentUser: store.userState.currentUser
})

const mapDispatchProps = dispatch => bindActionCreators({ fetchUser }, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Main)
