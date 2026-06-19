using Aslant.Grid;
using Aslant.Setup;
using UnityEngine;

namespace Aslant.Gameplay
{
    [DisallowMultipleComponent]
    public class WalkInputController : MonoBehaviour
    {
        [SerializeField] UnityEngine.Camera sceneCamera;
        [SerializeField] TileGridBuilder grid;
        [SerializeField] FigureWalker figureWalker;
        [SerializeField] LayerMask tileLayerMask = ~0;

        void Awake()
        {
            if (sceneCamera == null)
            {
                sceneCamera = UnityEngine.Camera.main;
            }

            if (grid == null)
            {
                grid = FindFirstObjectByType<TileGridBuilder>();
            }

            if (figureWalker == null)
            {
                figureWalker = FindFirstObjectByType<FigureWalker>();
            }
        }

        void Update()
        {
            if (!TryGetTapPosition(out var screenPosition))
            {
                return;
            }

            var ray = sceneCamera.ScreenPointToRay(screenPosition);
            if (!Physics.Raycast(ray, out var hit, 200f, tileLayerMask, QueryTriggerInteraction.Ignore))
            {
                return;
            }

            var tile = hit.collider.GetComponentInParent<GridTile>();
            if (tile == null)
            {
                return;
            }

            figureWalker.TryWalkTo(tile.Coordinate);
        }

        static bool TryGetTapPosition(out Vector2 screenPosition)
        {
#if UNITY_IOS || UNITY_ANDROID
            if (Input.touchCount > 0)
            {
                var touch = Input.GetTouch(0);
                if (touch.phase == TouchPhase.Began)
                {
                    screenPosition = touch.position;
                    return true;
                }
            }
#else
            if (Input.GetMouseButtonDown(0))
            {
                screenPosition = Input.mousePosition;
                return true;
            }
#endif
            screenPosition = default;
            return false;
        }
    }
}
