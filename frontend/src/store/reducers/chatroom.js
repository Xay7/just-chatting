import * as actionTypes from '../actions/actionTypes';
// remove objects after css is done
const DEFAULT_STATE = {
    roomID: '',
    roomName: '',
    chatRooms: {
        owned: [],
        joined: []
    },
    channels: [
        {
            "messages": [
                {
                    "author": "test",
                    "body": "yo",
                    "created_at": "2019-05-27T09:57:07.287Z"
                },
                {
                    "author": "xay",
                    "body": "xD",
                    "created_at": "2019-05-27T09:57:09.209Z"
                },
                {
                    "author": "xay",
                    "body": "sd",
                    "created_at": "2019-05-27T09:57:33.127Z"
                },
                {
                    "author": "xay",
                    "body": "asd",
                    "created_at": "2019-05-27T09:58:02.156Z"
                },
                {
                    "author": "xay",
                    "body": "gfdgfgd",
                    "created_at": "2019-05-27T09:58:12.168Z"
                },
                {
                    "author": "xay",
                    "body": "gfd",
                    "created_at": "2019-05-27T09:58:58.335Z"
                },
                {
                    "author": "xay",
                    "body": "yio",
                    "created_at": "2019-05-27T09:59:24.666Z"
                },
                {
                    "author": "xay",
                    "body": "asdasdsad",
                    "created_at": "2019-05-27T09:59:35.295Z"
                },
                {
                    "author": "xay",
                    "body": "asdsadas",
                    "created_at": "2019-05-27T09:59:47.841Z"
                },
                {
                    "author": "xay",
                    "body": "asd",
                    "created_at": "2019-05-27T10:00:14.434Z"
                },
                {
                    "author": "xay",
                    "body": "asdasdas",
                    "created_at": "2019-05-27T10:00:57.739Z"
                },
                {
                    "author": "xay",
                    "body": "lol",
                    "created_at": "2019-05-27T10:01:00.067Z"
                },
                {
                    "author": "xay",
                    "body": "xd",
                    "created_at": "2019-05-27T10:01:00.325Z"
                },
                {
                    "author": "test",
                    "body": "yo",
                    "created_at": "2019-05-27T10:01:07.749Z"
                },
                {
                    "author": "test",
                    "body": "cunt",
                    "created_at": "2019-05-27T10:01:08.302Z"
                },
                {
                    "author": "xay",
                    "body": "yo",
                    "created_at": "2019-05-27T10:01:09.998Z"
                },
                {
                    "author": "xay",
                    "body": "xD",
                    "created_at": "2019-05-27T10:01:10.285Z"
                },
                {
                    "author": "xay",
                    "body": "haha",
                    "created_at": "2019-05-27T10:02:04.258Z"
                },
                {
                    "author": "xay",
                    "body": "xd",
                    "created_at": "2019-05-27T10:02:04.905Z"
                },
                {
                    "author": "xay",
                    "body": "lol",
                    "created_at": "2019-05-27T12:02:51.471Z"
                },
                {
                    "author": "xay",
                    "body": "sadas",
                    "created_at": "2019-05-27T21:12:06.401Z"
                },
                {
                    "author": "xay",
                    "body": "hjk",
                    "created_at": "2019-05-28T11:59:12.063Z"
                },
                {
                    "author": "xay",
                    "body": ",.k",
                    "created_at": "2019-05-28T11:59:15.771Z"
                },
                {
                    "author": "xay",
                    "body": "sdf",
                    "created_at": "2019-05-28T12:02:36.773Z"
                },
                {
                    "author": "xay",
                    "body": "gfh",
                    "created_at": "2019-05-28T12:02:37.579Z"
                },
                {
                    "author": "xay",
                    "body": "ert",
                    "created_at": "2019-05-28T12:02:38.332Z"
                },
                {
                    "author": "xay",
                    "body": "dfg",
                    "created_at": "2019-05-28T12:02:39.769Z"
                },
                {
                    "author": "xay",
                    "body": "sdfdsf",
                    "created_at": "2019-05-28T12:03:41.285Z"
                },
                {
                    "author": "xay",
                    "body": "sdfgdfg",
                    "created_at": "2019-05-28T12:03:44.057Z"
                },
                {
                    "author": "xay",
                    "body": "dfgdfg",
                    "created_at": "2019-05-28T12:03:46.419Z"
                },
                {
                    "author": "xay",
                    "body": "sdffsdf",
                    "created_at": "2019-05-28T12:04:04.830Z"
                },
                {
                    "author": "xay",
                    "body": "sdfdsf",
                    "created_at": "2019-05-28T12:04:26.101Z"
                },
                {
                    "author": "xay",
                    "body": "asdsa",
                    "created_at": "2019-05-28T12:04:44.547Z"
                },
                {
                    "author": "xay",
                    "body": "asd",
                    "created_at": "2019-05-28T12:05:30.927Z"
                },
                {
                    "author": "xay",
                    "body": "dfg",
                    "created_at": "2019-05-28T12:06:38.620Z"
                },
                {
                    "author": "xay",
                    "body": "f",
                    "created_at": "2019-05-28T12:14:06.872Z"
                },
                {
                    "author": "xay",
                    "body": "j",
                    "created_at": "2019-05-28T12:14:08.120Z"
                },
                {
                    "author": "xay",
                    "body": "h",
                    "created_at": "2019-05-28T12:14:09.448Z"
                },
                {
                    "author": "xay",
                    "body": "abcccccc",
                    "created_at": "2019-05-28T12:16:04.740Z"
                },
                {
                    "author": "xay",
                    "body": "fd",
                    "created_at": "2019-05-28T12:24:43.433Z"
                },
                {
                    "author": "xay",
                    "body": "fg",
                    "created_at": "2019-05-28T12:25:54.083Z"
                },
                {
                    "author": "xay",
                    "body": "fd",
                    "created_at": "2019-05-28T12:26:44.607Z"
                },
                {
                    "author": "xay",
                    "body": "lol xd",
                    "created_at": "2019-05-28T12:26:50.082Z"
                },
                {
                    "author": "xay",
                    "body": "we",
                    "created_at": "2019-05-28T12:28:21.756Z"
                },
                {
                    "author": "xay",
                    "body": "got",
                    "created_at": "2019-05-28T12:28:22.556Z"
                },
                {
                    "author": "xay",
                    "body": "a",
                    "created_at": "2019-05-28T12:28:22.940Z"
                },
                {
                    "author": "xay",
                    "body": "lot",
                    "created_at": "2019-05-28T12:28:23.524Z"
                },
                {
                    "author": "xay",
                    "body": "ofm",
                    "created_at": "2019-05-28T12:28:24.210Z"
                },
                {
                    "author": "xay",
                    "body": "messages",
                    "created_at": "2019-05-28T12:28:25.373Z"
                },
                {
                    "author": "xay",
                    "body": "right",
                    "created_at": "2019-05-28T12:28:26.028Z"
                },
                {
                    "author": "xay",
                    "body": "okay",
                    "created_at": "2019-05-28T12:28:26.667Z"
                },
                {
                    "author": "xay",
                    "body": "buddy",
                    "created_at": "2019-05-28T12:28:27.351Z"
                },
                {
                    "author": "xay",
                    "body": "kek",
                    "created_at": "2019-05-29T10:28:13.983Z"
                },
                {
                    "author": "xay",
                    "body": "xd",
                    "created_at": "2019-05-29T10:28:14.513Z"
                }
            ],
            "id": "d3d795b6-b09d-43c7-8466-37a66fbfa97e",
            "name": "programming"
        },
        {
            "messages": [
                {
                    "author": "xay",
                    "body": "asd",
                    "created_at": "2019-05-27T10:02:09.795Z"
                },
                {
                    "author": "test",
                    "body": "asd",
                    "created_at": "2019-05-27T10:02:14.990Z"
                },
                {
                    "author": "test",
                    "body": "xd",
                    "created_at": "2019-05-27T10:02:15.352Z"
                },
                {
                    "author": "test",
                    "body": "asd",
                    "created_at": "2019-05-27T10:02:15.848Z"
                },
                {
                    "author": "xay",
                    "body": "asd",
                    "created_at": "2019-05-29T10:28:17.657Z"
                },
                {
                    "author": "xay",
                    "body": "so",
                    "created_at": "2019-05-29T10:28:38.824Z"
                },
                {
                    "author": "xay",
                    "body": "this id man",
                    "created_at": "2019-05-29T10:28:40.336Z"
                },
                {
                    "author": "xay",
                    "body": "opky",
                    "created_at": "2019-05-29T10:30:36.628Z"
                },
                {
                    "author": "xay",
                    "body": "as",
                    "created_at": "2019-05-29T10:30:37.335Z"
                },
                {
                    "author": "xay",
                    "body": "sd",
                    "created_at": "2019-05-29T10:30:37.529Z"
                },
                {
                    "author": "xay",
                    "body": "asd",
                    "created_at": "2019-05-29T10:30:37.845Z"
                },
                {
                    "author": "xay",
                    "body": "dsa",
                    "created_at": "2019-05-29T10:30:38.880Z"
                },
                {
                    "author": "xay",
                    "body": "gfd",
                    "created_at": "2019-05-29T10:30:39.400Z"
                },
                {
                    "author": "xay",
                    "body": "dffdg",
                    "created_at": "2019-05-29T10:30:40.211Z"
                },
                {
                    "author": "xay",
                    "body": "ddfg",
                    "created_at": "2019-05-29T10:30:41.188Z"
                }
            ],
            "id": "530a417c-0f25-4353-815c-490b40691636",
            "name": "games"
        }
    ],
    channelID: '',
    channelName: 'Programming',
    messages: [
        {
            "author": "xay",
            "body": "asd",
            "created_at": "Last Monday at 12:02 PM"
        },
        {
            "author": "test",
            "body": "asd",
            "created_at": "Last Monday at 12:02 PM"
        },
        {
            "author": "test",
            "body": "xd",
            "created_at": "Last Monday at 12:02 PM"
        },
        {
            "author": "test",
            "body": "asd",
            "created_at": "Last Monday at 12:02 PM"
        },
        {
            "author": "xay",
            "body": "asd",
            "created_at": "Today at 12:28 PM"
        },
        {
            "author": "xay",
            "body": "so",
            "created_at": "Today at 12:28 PM"
        },
        {
            "author": "xay",
            "body": "this id man",
            "created_at": "Today at 12:28 PM"
        },
        {
            "author": "xay",
            "body": "opky",
            "created_at": "Today at 12:30 PM"
        },
        {
            "author": "xay",
            "body": "as",
            "created_at": "Today at 12:30 PM"
        },
        {
            "author": "xay",
            "body": "sd",
            "created_at": "Today at 12:30 PM"
        },
        {
            "author": "xay",
            "body": "asd",
            "created_at": "Today at 12:30 PM"
        },
        {
            "author": "xay",
            "body": "dsa",
            "created_at": "Today at 12:30 PM"
        },
        {
            "author": "xay",
            "body": "gfd",
            "created_at": "Today at 12:30 PM"
        },
        {
            "author": "xay",
            "body": "dffdg",
            "created_at": "Today at 12:30 PM"
        },
        {
            "author": "xay",
            "body": "ddfg",
            "created_at": "Today at 12:30 PM"
        }
    ],
    showRoomOptions: false,
    updateRooms: false,
    channelDescription: 'Some kind of god of war description'
}

const reducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes.GET_ROOMS:
            return {
                ...state,
                chatRooms: action.chatRooms
            }
        case actionTypes.NEW_ROOM:
            return {
                ...state,
                chatRooms: action.chatRooms
            }
        case actionTypes.CHANGE_ROOM:
            return {
                ...state,
                roomID: action.roomID,
                roomName: action.roomName,
                channels: action.channels,
                channelName: action.channelName,
                channelID: ''
            }
        case actionTypes.JOIN_ROOM:
            return {
                ...state,
                chatRooms: action.chatRooms
            }
        case actionTypes.DELETE_ROOM:
            return {
                ...state,
                chatRooms: action.chatRooms,
                channels: [],
                updateRooms: true
            }
        case actionTypes.GET_MESSAGES:
            return {
                ...state,
                messages: action.messages
            }
        case actionTypes.NEW_CHANNEL:
            return {
                ...state,
                channels: action.channels
            }
        case actionTypes.CHANGE_CHANNEL:
            return {
                ...state,
                channelID: action.channelID,
                channelName: action.channelName,
                channelDescription: action.description
            }
        case actionTypes.SHOW_ROOM_OPTIONS:
            return {
                ...state,
                showRoomOptions: !state.showRoomOptions

            }
        default:
            return state;
    }
}

export default reducer;