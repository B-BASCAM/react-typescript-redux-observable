import { combineEpics, Epic } from "redux-observable";
import { switchMap, map, startWith, catchError, filter, mergeMap } from "rxjs/operators";
import { IState } from "../reducers";
import { from, of } from "rxjs";
import { isOfType } from "typesafe-actions";
import { addedTask, addingTask, addingTaskFailed, TaskAction, TaskActionTypes } from "../actions/taskActions";
import { addtaskservice } from "../../service/taskService";




const addTaskEpic: Epic<TaskAction, TaskAction, IState> = (
  action$,
  state$
) => action$.pipe(
  filter(isOfType(TaskActionTypes.ADD_TASK)),
  map((action) => {
    return action;

  }),
  mergeMap(action =>
    from(addtaskservice(action)).pipe(
      map(response =>
        {
          return addedTask(response.data)
        }
    
         ),
      startWith(addingTask()),
      catchError(() => of(addingTaskFailed()))
    )
  )
)

export default combineEpics(addTaskEpic);
