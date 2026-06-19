using UnityEngine;

namespace Aslant.Setup
{
    /// <summary>
    /// Greybox platforms at different heights that can appear connected from the fixed isometric view.
    /// </summary>
    [ExecuteAlways]
    [DisallowMultipleComponent]
    public class IllusionHintBuilder : MonoBehaviour
    {
        const string PlatformNamePrefix = "Platform";

        [SerializeField] Color platformColor = new(0.22f, 0.24f, 0.3f, 1f);

        Material platformMaterial;

        void OnEnable()
        {
            Rebuild();
        }

        void OnValidate()
        {
            Rebuild();
        }

        [ContextMenu("Rebuild Hint")]
        public void Rebuild()
        {
            EnsureMaterial();
            ClearGeneratedPlatforms();
            CreatePlatform("A", new Vector3(-1.5f, 0.5f, 0f), new Vector3(2f, 1f, 1f));
            CreatePlatform("B", new Vector3(1.5f, 2.5f, 2.5f), new Vector3(2f, 1f, 1f));
        }

        void EnsureMaterial()
        {
            if (platformMaterial == null)
            {
                var shader = Shader.Find("Standard") ?? Shader.Find("Universal Render Pipeline/Lit");
                platformMaterial = new Material(shader) { color = platformColor };
            }
            else
            {
                platformMaterial.color = platformColor;
            }
        }

        void ClearGeneratedPlatforms()
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

        void CreatePlatform(string label, Vector3 localPosition, Vector3 localScale)
        {
            var platform = GameObject.CreatePrimitive(PrimitiveType.Cube);
            platform.name = $"{PlatformNamePrefix}_{label}";
            platform.transform.SetParent(transform, false);
            platform.transform.localPosition = localPosition;
            platform.transform.localScale = localScale;
            platform.GetComponent<Renderer>().sharedMaterial = platformMaterial;

            var collider = platform.GetComponent<Collider>();
            if (collider != null && !Application.isPlaying)
            {
                DestroyImmediate(collider);
            }
        }
    }
}
