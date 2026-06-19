using System.Collections;
using System.Collections.Generic;
using Aslant.Pathfinding;
using Aslant.Setup;
using UnityEngine;

namespace Aslant.Gameplay
{
    [DisallowMultipleComponent]
    public class FigureWalker : MonoBehaviour
    {
        [SerializeField] TileGridBuilder grid;
        [SerializeField] float moveSpeed = 3.5f;
        [SerializeField] Vector2Int startCell = new(0, 0);

        Coroutine walkRoutine;
        Vector2Int currentCell;

        public Vector2Int CurrentCell => currentCell;
        public bool IsMoving => walkRoutine != null;

        void Awake()
        {
            if (grid == null)
            {
                grid = FindFirstObjectByType<TileGridBuilder>();
            }
        }

        void Start()
        {
            currentCell = startCell;
            SnapToCell(currentCell);
        }

        public void SetStartCell(Vector2Int cell)
        {
            startCell = cell;
            currentCell = cell;
            SnapToCell(cell);
        }

        public bool TryWalkTo(Vector2Int destination)
        {
            if (grid == null || IsMoving || destination == currentCell)
            {
                return false;
            }

            var path = GridPathfinder.FindPath(
                currentCell,
                destination,
                grid.Width,
                grid.Depth,
                grid.IsWalkable);

            if (path == null || path.Count == 0)
            {
                return false;
            }

            if (walkRoutine != null)
            {
                StopCoroutine(walkRoutine);
            }

            walkRoutine = StartCoroutine(WalkAlongPath(path));
            return true;
        }

        void SnapToCell(Vector2Int cell)
        {
            transform.position = grid.GetWorldPositionForFigure(cell);
        }

        IEnumerator WalkAlongPath(List<Vector2Int> path)
        {
            for (var i = 1; i < path.Count; i++)
            {
                var from = grid.GetWorldPositionForFigure(path[i - 1]);
                var to = grid.GetWorldPositionForFigure(path[i]);
                var duration = Vector3.Distance(from, to) / moveSpeed;
                var elapsed = 0f;

                while (elapsed < duration)
                {
                    elapsed += Time.deltaTime;
                    var t = Mathf.Clamp01(elapsed / duration);
                    transform.position = Vector3.Lerp(from, to, t);
                    yield return null;
                }

                transform.position = to;
                currentCell = path[i];
            }

            walkRoutine = null;
        }
    }
}
