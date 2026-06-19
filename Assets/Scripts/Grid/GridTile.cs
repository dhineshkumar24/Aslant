using UnityEngine;

namespace Aslant.Grid
{
    [DisallowMultipleComponent]
    public class GridTile : MonoBehaviour
    {
        public int GridX { get; private set; }
        public int GridZ { get; private set; }

        public Vector2Int Coordinate => new(GridX, GridZ);

        public void Initialize(int gridX, int gridZ)
        {
            GridX = gridX;
            GridZ = gridZ;
        }
    }
}
