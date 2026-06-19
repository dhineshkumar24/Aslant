using UnityEngine;

namespace Aslant.Setup
{
    [ExecuteAlways]
    [DisallowMultipleComponent]
    public class FigurePlaceholder : MonoBehaviour
    {
        const string FigureChildName = "FigureMesh";

        [SerializeField] float capsuleHeight = 1.2f;
        [SerializeField] float capsuleRadius = 0.25f;
        [SerializeField] Color bodyColor = new(0.12f, 0.12f, 0.14f, 1f);
        [SerializeField] Color lanternColor = new(1f, 0.55f, 0.2f, 1f);
        [SerializeField] float lanternIntensity = 1.4f;

        Material bodyMaterial;
        GameObject figureMesh;
        Light lanternLight;

        public float CapsuleHeight => capsuleHeight;

        void OnEnable()
        {
            if (Application.isPlaying && figureMesh != null)
            {
                return;
            }

            Rebuild();
        }

        void OnValidate()
        {
            if (!Application.isPlaying)
            {
                Rebuild();
            }
        }

        [ContextMenu("Rebuild Figure")]
        public void Rebuild()
        {
            EnsureBodyMaterial();
            ClearFigure();

            figureMesh = GameObject.CreatePrimitive(PrimitiveType.Capsule);
            figureMesh.name = FigureChildName;
            figureMesh.transform.SetParent(transform, false);
            figureMesh.transform.localPosition = new Vector3(0f, capsuleHeight * 0.5f, 0f);
            figureMesh.transform.localScale = new Vector3(capsuleRadius * 2f, capsuleHeight * 0.5f, capsuleRadius * 2f);
            figureMesh.GetComponent<Renderer>().sharedMaterial = bodyMaterial;

            var collider = figureMesh.GetComponent<Collider>();
            if (collider != null)
            {
                if (Application.isPlaying)
                {
                    Destroy(collider);
                }
                else
                {
                    DestroyImmediate(collider);
                }
            }

            var lantern = new GameObject("LanternLight");
            lantern.transform.SetParent(figureMesh.transform, false);
            lantern.transform.localPosition = new Vector3(0f, 0.35f, 0.15f);

            lanternLight = lantern.AddComponent<Light>();
            lanternLight.type = LightType.Point;
            lanternLight.color = lanternColor;
            lanternLight.intensity = lanternIntensity;
            lanternLight.range = 4f;
        }

        void EnsureBodyMaterial()
        {
            if (bodyMaterial == null)
            {
                var shader = Shader.Find("Standard") ?? Shader.Find("Universal Render Pipeline/Lit");
                bodyMaterial = new Material(shader) { color = bodyColor };
            }
            else
            {
                bodyMaterial.color = bodyColor;
            }
        }

        void ClearFigure()
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

            figureMesh = null;
            lanternLight = null;
        }
    }
}
