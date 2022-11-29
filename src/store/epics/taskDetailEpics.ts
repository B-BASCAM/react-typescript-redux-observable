import { combineEpics, Epic } from "redux-observable";
import { switchMap, map, startWith, catchError, filter, mergeMap } from "rxjs/operators";
import { IState } from "../reducers";
import { from, of } from "rxjs";
import { isOfType } from "typesafe-actions";
import { loadedTaskDetail, loadingTaskDetail, loadingTaskDetailFailed, TaskDetailAction, TaskDetailActionTypes } from "../actions/taskDetailActions";
import { loadTaskDetailService } from "../../service/taskDetailService";




const loadTaskDetailEpic: Epic<TaskDetailAction, TaskDetailAction, IState> = (
  action$,
  state$
) => action$.pipe(
  filter(isOfType(TaskDetailActionTypes.LOAD_TASKDETAIL)),
  map((action) => {
    return action;

  }),
  mergeMap(action =>
    from(loadTaskDetailService(action)).pipe(
      map(response => {
        return loadedTaskDetail(response.data)
      }

      ),
      startWith(loadingTaskDetail()),
      catchError(() => of(loadingTaskDetailFailed()))
    )
  )
)

export default combineEpics(loadTaskDetailEpic);
