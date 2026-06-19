using UnityEngine;

namespace Aslant.Setup
{
    [ExecuteAlways]
    [DisallowMultipleComponent]
    public class TileGridBuilder : MonoBehaviour
    {
        const string TileNamePrefix = "Tile";

        [SerializeField] int width = 6;
        [SerializeField] int depth = 6;
        [SerializeField] float tileSize = 1f;
        [SerializeField] float tileHeight = 0.15f;
        [SerializeField] Color tileColor = new(0.16f, 0.18f, 0.24f, 1f);
        [SerializeField] Color tileEdgeColor = new(0.1f, 0.11f, 0.15f, 1f);

        Material tileMaterial;
        Material edgeMaterial;

        void OnEnable()
        {
            Rebuild();
        }

        void OnValidate()
        {
            Rebuild();
        }

        [ContextMenu("Rebuild Grid")]
        public void Rebuild()
        {
            EnsureMaterials();
            ClearGeneratedTiles();

            var offsetX = (width - 1) * tileSize * 0.5f;
            var offsetZ = (depth - 1) * tileSize * 0.5f;

            for (var x = 0; x < width; x++)
            {
                for (var z = 0; z < depth; z++)
                {
                    CreateTile(x, z, offsetX, offsetZ);
                }
            }
        }

        void EnsureMaterials()
        {
            if (tileMaterial == null)
            {
                tileMaterial = CreateMaterial(tileColor);
            }
            else
            {
                tileMaterial.color = tileColor;
            }

            if (edgeMaterial == null)
            {
                edgeMaterial = CreateMaterial(tileEdgeColor);
            }
            else
            {
                edgeMaterial.color = tileEdgeColor;
            }
        }

        static Material CreateMaterial(Color color)
        {
            var shader = Shader.Find("Standard");
            if (shader == null)
            {
                shader = Shader.Find("Universal Render Pipeline/Lit");
            }

            var material = new Material(shader);
            material.color = color;
            return material;
        }

        void ClearGeneratedTiles()
        {
            for (var i = transform.childCount - 1; i >= 0; i--)
            {
                var child = transform.GetChild(i).gameObject;
                if (Application.isPlaying)
                {
                    Destroy(child);
                }
                else
                {
                    DestroyImmediate(child);
                }
            }
        }

        void CreateTile(int x, int z, float offsetX, float offsetZ)
        {
            var tile = GameObject.CreatePrimitive(PrimitiveType.Cube);
            tile.name = $"{TileNamePrefix}_{x}_{z}";
            tile.transform.SetParent(transform, false);
            tile.transform.localPosition = new Vector3(
                x * tileSize - offsetX,
                tileHeight * 0.5f,
                z * tileSize - offsetZ
            );
            tile.transform.localScale = new Vector3(tileSize * 0.96f, tileHeight, tileSize * 0.96f);
            tile.GetComponent<Renderer>().sharedMaterial = tileMaterial;

            var collider = tile.GetComponent<Collider>();
            if (collider != null && !Application.isPlaying)
            {
                DestroyImmediate(collider);
            }
        }
    }
}
