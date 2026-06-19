using UnityEngine;

namespace Aslant.CameraRig
{
    [RequireComponent(typeof(UnityEngine.Camera))]
    [DisallowMultipleComponent]
    public class FixedIsometricCamera : MonoBehaviour
    {
        [SerializeField] float elevationDegrees = 30f;
        [SerializeField] float yawDegrees = 45f;
        [SerializeField] float orthographicSize = 7f;
        [SerializeField] Vector3 lookAtTarget = Vector3.zero;
        [SerializeField] float distance = 24f;
        [SerializeField] Color backgroundColor = new(0.04f, 0.05f, 0.08f, 1f);

        UnityEngine.Camera cam;

        void Awake()
        {
            cam = GetComponent<UnityEngine.Camera>();
            ApplySettings();
        }

        void LateUpdate()
        {
            ApplyTransform();
        }

        void ApplySettings()
        {
            cam.orthographic = true;
            cam.orthographicSize = orthographicSize;
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = backgroundColor;
            ApplyTransform();
        }

        void ApplyTransform()
        {
            var rotation = Quaternion.Euler(elevationDegrees, yawDegrees, 0f);
            transform.rotation = rotation;
            transform.position = lookAtTarget + rotation * (Vector3.back * distance);
        }

#if UNITY_EDITOR
        void OnValidate()
        {
            if (cam == null)
            {
                cam = GetComponent<UnityEngine.Camera>();
            }

            if (cam != null)
            {
                ApplySettings();
            }
        }
#endif
    }
}
